export function isBooleanish(value: any) {
  if (typeof value === 'boolean') {
    return true
  } else if (typeof value === 'string') {
    const lowerCaseValue = value.toLowerCase().trim()

    return lowerCaseValue === 'true' || lowerCaseValue === 'false'
  }

  return false
}
