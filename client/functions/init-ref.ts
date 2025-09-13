import type { ComponentInternalInstance } from 'vue'
import { camelCase } from 'change-case'

/**
 * Initialize a reactive reference based on the props passed to the component
 *
 * Basically, if an actual prop is passed to the component, it creates a `model`
 * and will emit the update events as expected
 *
 * If no prop is passed, it will create its own `ref` and will be maintained internally
 *
 * This is very similar idea to the Vue's `defineModel`, but can be also used in stores
 *
 * Use-case:
 * - In stores, where we initialize the state with provided props
 */
export function initRef<T, K>(payload: {
  defaultValue: K
  props?: T
  propName: string
  instance?: ComponentInternalInstance | null
}) {
  const { propName, instance, props, defaultValue } = payload

  if (!instance || !props) {
    return ref(defaultValue)
  }

  const providedProps = Object.keys(instance.vnode?.props ?? {})
    .map(propName => camelCase(propName))

  return providedProps.includes(propName)
    ? useVModel(instance?.props, propName)
    : ref(defaultValue)
}
