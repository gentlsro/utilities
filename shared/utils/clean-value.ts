/**
 * Will take a value, checks for `null`, `undefined`, trims it and returns a
 * string or `null`.
 */
export function cleanValue(value?: any) {
  if (isNil(value)) {
    return null
  }

  const stringValue = String(value).trim()

  return stringValue || null
}
