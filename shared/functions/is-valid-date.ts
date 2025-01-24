import * as dayjs from 'dayjs'

export function isValidDate(value: any) {
  if (
    value instanceof Date
    || (typeof value === 'object' && value instanceof dayjs.Dayjs)
  ) {
    // Check if it's a Date instance and valid
    return true
  } else if (typeof value === 'string' || typeof value === 'number') {
    // Try to parse strings and numbers
    const date = new Date(value)

    return !Number.isNaN(date.getTime())
  }

  // Return false for other types
  return false
}
