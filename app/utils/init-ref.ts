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

  // const providedProps = Object.keys(instance.vnode?.props ?? {})
  //   .map(propName => camelCase(propName)) as Array<keyof T>

  let _defaultValue = defaultValue

  if (props?.[propName] !== undefined) {
    _defaultValue = props?.[propName]
  }

  let isFirstAccess = true

  const result = dynamicProps.includes(propName)
  // When the prop is dynamic => the prop was passed to the component (even if it's `undefined`)
    ? computed({
      get: () => {
        return isFirstAccess ? (props?.[propName] ?? _defaultValue) : props?.[propName]
      },
      set(value) {
        instance.emit(`update:${propName.toString()}`, value)
      },
    }) as Ref<T[K]>

    // When the prop is not dynamic => the prop was not passed to the component at all
    : ref(_defaultValue) as Ref<T[K]>

  // Set the initial value if needed
  if (initWith?.condition(payload)) {
    const initialValue = initWith.fnc(payload)
    result.value = initialValue
  }

  isFirstAccess = false

  return result
}
