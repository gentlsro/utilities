import { dayjs } from './$date'

/**
 * ISO 8601 date or datetime.
 * Examples: `2024-08-19`, `2024-08-19T12:00:00.000Z`, `2024-08-19 12:00:00+02:00`
 */
const isoDateRegex
  = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/

/**
 * Numeric slash dates with a 4-digit year.
 * Examples: `08/19/2026`, `2024/08/19`, `8/19/2026 12:00`
 */
const numericDateRegex
  = /^(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}\/\d{1,2}\/\d{1,2})(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/

// Unix milliseconds: 1e11 ≈ 1973-03-03, 1e14 ≈ 5138-11-16
const MIN_UNIX_MS = 1e11
const MAX_UNIX_MS = 1e14

function isExistingUtcDate(year: number, month: number, day: number) {
  const utc = new Date(Date.UTC(year, month - 1, day))

  return utc.getUTCFullYear() === year
    && utc.getUTCMonth() === month - 1
    && utc.getUTCDate() === day
}

function isValidDateString(value: string) {
  const trimmed = value.trim()
  const isIso = isoDateRegex.test(trimmed)
  const isNumericDate = numericDateRegex.test(trimmed)

  if (!isIso && !isNumericDate) {
    return false
  }

  if (Number.isNaN(new Date(trimmed).getTime())) {
    return false
  }

  // Reject overflow dates like `2024-02-30` that Date.parse silently rolls forward
  if (isIso) {
    return isExistingUtcDate(
      Number(trimmed.slice(0, 4)),
      Number(trimmed.slice(5, 7)),
      Number(trimmed.slice(8, 10)),
    )
  }

  return true
}

function isValidDateNumber(value: number) {
  return Number.isFinite(value)
    && value >= MIN_UNIX_MS
    && value <= MAX_UNIX_MS
}

export function isValidDate(value: any) {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime())
  }

  if (dayjs.isDayjs(value)) {
    return value.isValid()
  }

  if (typeof value === 'string') {
    return isValidDateString(value)
  }

  if (typeof value === 'number') {
    return isValidDateNumber(value)
  }

  return false
}
