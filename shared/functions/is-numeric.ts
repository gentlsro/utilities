export function isNumeric(value: any) {
  if (typeof value === 'string') {
    const num = Number.parseFloat(value)
    return (
      !Number.isNaN(num)
      && Number.isFinite(num)
      && num.toString() === value.trim()
    )
  } else if (typeof value === 'number') {
    return !Number.isNaN(value) && Number.isFinite(value)
  } else {
    return false
  }
}
