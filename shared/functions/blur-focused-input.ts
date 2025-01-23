/**
 * Blurs any focused input element
 */
export function blurFocusedInput() {
  const activeElement = useSharedActiveElement()

  if (
    activeElement.value?.tagName === 'INPUT'
    || activeElement.value?.tagName === 'TEXTAREA'
    || activeElement.value?.contentEditable
  ) {
    activeElement.value.blur()
  }
}
