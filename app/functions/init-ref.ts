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
export function initRef<T extends IItem, K extends keyof T>(payload: {
  defaultValue?: T[K]
  props?: T
  propName: K
  instance?: ComponentInternalInstance | null

  initWith?: {
    condition: (payload: {
      instance?: ComponentInternalInstance | null
      props?: T
      propName: K
    }) => boolean

    fnc: (payload: {
      instance?: ComponentInternalInstance | null
      props?: T
      propName: K
    }) => T[K]
  }
}) {
  const { propName, instance, props, defaultValue, initWith } = payload

  if (!instance || !props) {
    return ref(defaultValue) as Ref<T[K]>
  }

  // @ts-expect-error Vue doesn't type this
  const dynamicProps = (instance.vnode?.dynamicProps ?? [])
    .map((propName: string) => camelCase(propName)) as Array<keyof T>

  const providedProps = Object.keys(instance.vnode?.props ?? {})
    .map(propName => camelCase(propName)) as Array<keyof T>

  let _defaultValue = defaultValue

  if (providedProps.includes(propName) && props?.[propName] !== undefined) {
    _defaultValue = props?.[propName]
  }

  const result = dynamicProps.includes(propName)
    ? useVModel(props, propName, undefined, { defaultValue: _defaultValue }) as Ref<T[K]>
    : ref(_defaultValue) as Ref<T[K]>

  // Set the initial value if needed
  if (initWith?.condition(payload)) {
    const initialValue = initWith.fnc(payload)
    result.value = initialValue
  }

  return result
}
