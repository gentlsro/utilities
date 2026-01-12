export function isNumeric(value: any) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') {
      return false
    }
    const num = Number(trimmed)
    return !Number.isNaN(num) && Number.isFinite(num)
  } else if (typeof value === 'number') {
    return !Number.isNaN(value) && Number.isFinite(value)
  } else {
    return false
  }
}
