import type { Datetime } from '../shared/types/datetime.type'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { toValue } from 'vue'
import { useDateUtils } from '../app/composables/useDateUtils'
import { $date } from '../shared/utils/$date'

/**
 * These bugs (shifted month grid, wrong "today" cell) are only visible outside of
 * UTC ~ periods built from local midnights do not line up with days parsed as UTC
 * once the offset is non-zero. Pin a timezone so the suite catches them everywhere.
 */
const ORIGINAL_TZ = process.env.TZ
process.env.TZ = 'Europe/Prague'

afterAll(() => {
  process.env.TZ = ORIGINAL_TZ
})

// Nuxt auto-imports in application code (`$date()` is "now" without arguments)
const NOW = '2026-09-14 01:30:00'
const NOW_INSTANT = $date(NOW).valueOf()

vi.stubGlobal('toValue', toValue)
vi.stubGlobal('$date', (date?: Datetime, options?: { utc?: boolean }, strict?: boolean) => {
  return date === undefined || date === null
    ? $date(NOW_INSTANT, options)
    : $date(date, options, strict)
})

const {
  formatDate,
  getCalendarDateValue,
  getDaysInPeriod,
  getExtendedPeriod,
  getPeriod,
} = useDateUtils({ localeIso: 'cs-CZ' })

/**
 * Mirrors DatePicker: value -> period -> extended period -> day grid. Picker values are
 * plain instants ~ local midnight of the day, or UTC midnight of it in UTC mode.
 */
function getCalendarGrid(utc: boolean, date = utc ? '2026-09-14T00:00:00.000Z' : '2026-09-14') {
  const period = getPeriod({ date, unit: 'month', utc })
  const extendedPeriod = getExtendedPeriod({
    date,
    unit: 'month',
    minCountOfWeeks: 6,
    utc,
  })

  return {
    internalValue: date,
    period,
    extendedPeriod,
    days: getDaysInPeriod(extendedPeriod, { currentPeriod: period, utc }),
  }
}

/** The September 2026 grid as the user sees it: Monday first, 6 weeks. */
const EXPECTED_DATES = Array.from({ length: 42 }, (_, idx) => {
  return $date('2026-08-31').add(idx, 'day').format('YYYY-MM-DD')
})

describe.each([false, true])('attendance calendar grid (utc: %s)', utc => {
  it('lays the month out on the same calendar dates that are displayed', () => {
    const { period, days } = getCalendarGrid(utc)

    expect(period.periodStart.format('YYYY-MM-DD')).toBe('2026-09-01')
    expect(period.periodEnd.format('YYYY-MM-DD')).toBe('2026-09-30')
    expect(days.map(day => day.dateString)).toEqual(EXPECTED_DATES)
    expect(days.map(day => day.dayOfMonth)).toEqual(EXPECTED_DATES.map(date => $date(date).date()))
    expect(days.slice(0, 7).map(day => day.dayOfWeek)).toEqual([1, 2, 3, 4, 5, 6, 0])
  })

  it('highlights exactly the current local day', () => {
    const { days } = getCalendarGrid(utc)

    expect(days.filter(day => day.isToday).map(day => day.dateString)).toEqual(['2026-09-14'])
  })

  it('labels the month with its name', () => {
    const { internalValue } = getCalendarGrid(utc)
    const label = formatDate(internalValue, utc ? 'utcMonth' : 'month')

    expect(label).toMatch(/^\p{L}+$/u)
  })
})

describe('calendar date values', () => {
  it('keeps the calendar date, only the frame differs', () => {
    const source = $date('2026-09-14 23:30:00')

    expect(getCalendarDateValue(source).format('YYYY-MM-DD HH:mm')).toBe('2026-09-14 00:00')
    expect(getCalendarDateValue(source, { utc: true }).toISOString()).toBe('2026-09-14T00:00:00.000Z')
  })
})

describe('attendance multiple-add payload', () => {
  it('carries every selected day as that day', () => {
    const { days } = getCalendarGrid(false)
    const selectedDays = ['2026-09-21', '2026-09-22', '2026-09-23']
    const selectedDates = days
      .filter(day => selectedDays.includes(day.dateString))
      .map(day => $date(day.dateString, { utc: false }))

    // What the pane sends
    const payload = selectedDates.map(date => $date(date).format('YYYY-MM-DD'))
    expect(payload).toEqual(selectedDays)

    // What the API rebuilds from it ~ one attendance per day, same day
    const serverDays = payload.map(dateString => {
      const [year, month, day] = dateString.split('-').map(Number)
      const serverDate = new Date(year, month - 1, day)
      serverDate.setHours(8, 0, 0, 0)

      return $date(serverDate).format('YYYY-MM-DD')
    })
    expect(serverDays).toEqual(selectedDays)
  })
})
