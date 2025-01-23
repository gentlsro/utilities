/**
 * Blurs any focused input element
 */
export function blurAnyFocusedInput() {
  const activeElement = useActiveElement()

  if (
    activeElement.value?.tagName === 'INPUT'
    || activeElement.value?.tagName === 'TEXTAREA'
    || activeElement.value?.contentEditable
  ) {
    activeElement.value.blur()
  }
}
