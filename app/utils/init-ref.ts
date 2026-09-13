import type { ComponentInternalInstance } from 'vue'
import { initLegacyRef } from './init-ref-legacy'

type InitRefContext<T, K extends keyof T> = {
  props?: T
  propName: K
  /** @deprecated Omit this property to use the renderer-independent model. */
  instance?: ComponentInternalInstance | null
}

type InitRefOptions<T, K extends keyof T> = InitRefContext<T, K> & {
  defaultValue?: T[K]
  initWith?: {
    condition: (context: InitRefContext<T, K>) => boolean
    fnc: (context: InitRefContext<T, K>) => T[K]
  }
}

/**
 * Create during the owner's setup when props are supplied; otherwise own a local ref.
 * defaultValue is a read fallback for undefined, never an implicit parent update.
 * initWith writes through the model and therefore emits for a controlled binding.
 * Explicit instance (including null/undefined) retains the old VDOM contract.
 */
export function initRef<T extends IItem, K extends keyof T & string>(payload: InitRefOptions<T, K>): Ref<T[K]> {
  if ('instance' in payload) {
    return initLegacyRef(payload)
  }

  const { props, propName, defaultValue, initWith } = payload
  const fallback = ref(defaultValue && typeof defaultValue === 'object'
    ? cloneDeep(defaultValue)
    : defaultValue)
  const result = props
    ? useModel(props, propName, {
        get: value => value === undefined ? fallback.value : value,
      })
    : fallback

  if (initWith?.condition(payload)) {
    result.value = initWith.fnc(payload)
  }

  return result as Ref<T[K]>
}
