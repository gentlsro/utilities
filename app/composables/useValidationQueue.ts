type ValidationProcessByFieldInput = Record<
  string,
  [() => void, timeoutMs?: number] | (() => void)
>

export type ValidationProcessByField = Record<
  string,
  Array<[() => void, timeoutMs?: number]>
>

// Provide/Inject
const validationQueueKey = Symbol('__validationQueue')

/**
 * In some cases, the validation fields are hidden (for example when they are
 * on a non-visible tab). In our `ValidationDrawer` component, we let users click
 * on an invalid field that should focus the field. Obviously, if the field is hidden,
 * the focus will not work, so we need this process to "show" the field before focusing it.
 *
 * Example
 * We have a form with 2 tabs. The second tab has a required field (`name`) that is not filled.
 * The first tab is currently selected, so the field on second tab is hidden.
 * We use this function as follows:
 *
 * useValidationQueue {
 *   name: [() => { tab.value = 'second' }, 500],
 * }
 *
 * This function also "collects" all the validation processes from all the child
 * components and calls all the functions from the process.
 */
export function useValidationQueue(
  _validationProcessByField: ValidationProcessByFieldInput = {},
) {
  const validationProcessByField = inject(
    validationQueueKey,
    ref<ValidationProcessByField>({}),
  )

  const registrations = Object.entries(_validationProcessByField).map(([key, value]) => {
    const process: [() => void, timeoutMs?: number] = Array.isArray(value) ? value : [value]
    validationProcessByField.value[key] ??= []
    validationProcessByField.value[key].push(process)

    return { key, process }
  })

  onScopeDispose(() => {
    for (const { key, process } of registrations) {
      const current = validationProcessByField.value[key]
      const index = current?.indexOf(process) ?? -1
      if (index >= 0) {
        current!.splice(index, 1)
      }
      if (current?.length === 0) {
        delete validationProcessByField.value[key]
      }
    }
  })

  provide(validationQueueKey, validationProcessByField)

  return validationProcessByField
}
