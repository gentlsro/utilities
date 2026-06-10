// Functions
import { klona } from 'klona/full'

// Types
import type { NonUndefined } from 'utility-types'
import type { UnwrapRef, MaybeRefOrGetter } from 'vue'

type IOptions<T, Transformed = T> = {
  /**
   * When true, watch `initialValue` and run `syncFromOrigin` on deep changes.
   */
  autoSyncFromOrigin?: MaybeRefOrGetter<boolean>
  autoSyncFromParent?: MaybeRefOrGetter<boolean>
  emitName?: string
  modifyFnc?: (value: T, currentValue?: Transformed) => NonUndefined<Transformed>

  /**
   * @deprecated Use `autoSyncFromOrigin`
   */
}

export function useRefReset<T, Transformed = T>(
  initialValue: MaybeRefOrGetter<T>,
  options?: IOptions<T, Transformed>,
) {
  const opts = options ?? {}
  const autoSyncFromOrigin = computed(() =>
    toValue(opts.autoSyncFromOrigin) ?? toValue(opts.autoSyncFromParent) ?? false,
  )
  const { emitName, modifyFnc } = opts

  const instance = getCurrentInstance()
  let _initialValue = toValue(initialValue)
  const originalValue = ref(klona(_initialValue))

  const model = ref(
    klona(toValue(modifyFnc?.(_initialValue) || _initialValue)),
  ) as Ref<NonUndefined<Transformed>>

  function runSyncToOrigin(modelArg: any, syncOriginalValue = true) {
    const isModelArray = Array.isArray(toValue(initialValue))

    if (typeof _initialValue === 'object' && !isModelArray) {
      Object.assign(toValue(initialValue) as IItem, modelArg)
    } else if (isModelArray) {
      ; (toValue(initialValue) as any[]).splice(
        0,
        (toValue(initialValue) as any[]).length,
        ...(modelArg || []),
      )
    } else if (isRef(initialValue)) {
      (initialValue as Ref<any>).value = modelArg
    }

    // In some cases, we also need to emit the event for Vue to see the changes
    if (emitName) {
      instance?.emit(emitName, toValue(initialValue))
    }

    // When syncing to origin, we don't necessarily want to also overwrite the original value
    // to eventually be able to reset the model to the actual original value
    if (syncOriginalValue) {
      originalValue.value = klona(toValue(initialValue) as any)
    }
  }

  function runSyncFromOrigin() {
    _initialValue = toValue(initialValue)
    originalValue.value = klona(toValue(modifyFnc?.(_initialValue, extendedModel.value) || _initialValue) as UnwrapRef<T>)

    reset()
  }

  const extendedModel = extendRef(model, {
    /**
     * Sync the value to the origin (`initialValue` source: ref, getter, or plain value).
     */
    syncToOrigin: runSyncToOrigin,

    /**
     * @deprecated Use `syncToOrigin`.
     */
    syncToParent: runSyncToOrigin,

    /**
     * Sync the value from the origin (`initialValue`).
     */
    syncFromOrigin: runSyncFromOrigin,

    /**
     * @deprecated Use `syncFromOrigin`.
     */
    syncFromParent: runSyncFromOrigin,

    /**
     * Reset the value to the original value
     */
    reset: () => {
      model.value = klona(originalValueModified.value) as NonUndefined<Transformed>
    },
  })

  const originalValueModified = computed(() => {
    return modifyFnc?.(originalValue.value as T, extendedModel.value) || originalValue.value
  })

  /**
   * Check if the model has been modified
   */
  const isModified = computed(() => {
    return !isEqual(originalValueModified.value, model.value)
  })

  // Exposed functions
  function reset() {
    extendedModel.reset()
  }

  function syncFromOrigin() {
    extendedModel.syncFromOrigin()
  }

  /**
   * @deprecated Use `syncFromOrigin`.
   */
  function syncFromParent() {
    syncFromOrigin()
  }

  function syncToOrigin(_model?: any, syncOriginalValue?: boolean) {
    extendedModel.syncToOrigin(_model ?? model.value, syncOriginalValue)
  }

  /**
   * @deprecated Use `syncToOrigin`.
   */
  function syncToParent(_model?: any, syncOriginalValue?: boolean) {
    syncToOrigin(_model, syncOriginalValue)
  }

  /**
   * Similar to `syncFromOrigin`, but instead of syncing from `initialValue`,
   * it sets the value to the given value
   */
  function setModel(value: T) {
    _initialValue = value
    originalValue.value = klona(value)
    extendedModel.value = klona(toValue(modifyFnc?.(value))) as NonUndefined<Transformed>

    reset()
  }

  watch(
    [() => toValue(initialValue), autoSyncFromOrigin],
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
    syncFromParent,
    /** @deprecated Use `syncToOrigin`. */
    syncToParent,
  }
}
