// Functions
import { klona } from 'klona/full'

// Types
import type { NonUndefined } from 'utility-types'
import type { MaybeRefOrGetter } from 'vue'

type IOptions<T, Transformed = T> = {
  /**
   * When true, watch `initialValue` and run `syncFromOrigin` on deep changes.
   */
  autoSyncFromOrigin?: MaybeRefOrGetter<boolean>
  /** @deprecated Use `autoSyncFromOrigin`. */
  autoSyncFromParent?: MaybeRefOrGetter<boolean>
  /** @deprecated For VDOM consumers. Prefer onSyncToOrigin. */
  emitName?: string
  /** Called after synchronizing the origin. */
  onSyncToOrigin?: (value: T) => void
  modifyFnc?: (value: T, currentValue?: Transformed) => NonUndefined<Transformed>
}

export function useRefReset<T, Transformed = T>(
  initialValue: MaybeRefOrGetter<T>,
  options?: IOptions<T, Transformed>,
) {
  const opts = options ?? {}
  const autoSyncFromOrigin = computed(() =>
    toValue(opts.autoSyncFromOrigin) ?? toValue(opts.autoSyncFromParent) ?? false,
  )
  const { onSyncToOrigin, modifyFnc } = opts

  const legacyOwner = opts.emitName ? getCurrentInstance() : null
  const source = toValue(initialValue)
  const baseline = shallowRef(klona(modifyFnc?.(source) ?? source))
  const model = ref(klona(baseline.value)) as Ref<NonUndefined<Transformed>>

  function reset() {
    model.value = klona(baseline.value) as NonUndefined<Transformed>
  }

  function setModel(value: T) {
    baseline.value = klona(modifyFnc?.(value, model.value) ?? value)
    reset()
  }

  function syncFromOrigin() {
    setModel(toValue(initialValue))
  }

  function syncToOrigin(value: unknown = model.value, syncOriginalValue = true) {
    const origin = toValue(initialValue)
    const saved = klona(value)
    if (Array.isArray(origin) && Array.isArray(saved)) {
      origin.splice(0, origin.length, ...saved)
    } else if (isPlainObject(origin) && isPlainObject(saved)) {
      Object.assign(origin as object, saved)
    } else if (isRef(initialValue) && !isReadonly(initialValue)) {
      const writable = initialValue as Ref<T>
      writable.value = saved as T
    }

    const committed = toValue(initialValue)
    if (opts.emitName) {
      legacyOwner?.emit(opts.emitName, committed)
    }
    onSyncToOrigin?.(committed)
    if (syncOriginalValue) {
      baseline.value = klona(modifyFnc?.(committed, model.value) ?? committed)
    }
  }

  const extendedModel = extendRef(model, {
    reset,
    syncFromOrigin,
    syncToOrigin,
    /** @deprecated Use syncFromOrigin. */
    syncFromParent: syncFromOrigin,
    /** @deprecated Use syncToOrigin. */
    syncToParent: syncToOrigin,
  })
  const isModified = computed(() => !isEqual(baseline.value, model.value))

  watch(
    () => toValue(initialValue),
    () => {
      if (autoSyncFromOrigin.value) {
        syncFromOrigin()
      }
    },
    { deep: true },
  )

  return {
    model: extendedModel,
    isModified,
    setModel,
    modifyFnc,
    reset,
    syncFromOrigin,
    syncToOrigin,
    /** @deprecated Use `syncFromOrigin`. */
    syncFromParent: syncFromOrigin,
    /** @deprecated Use `syncToOrigin`. */
    syncToParent: syncToOrigin,
  }
}
