import type { Dayjs } from 'dayjs'

// Types
import type { Period } from '../types/period.type'

export class Day {
  dateString: string
  dayOfWeek: number
  dayOfMonth: number
  isHoliday: boolean
  isWeekend: boolean
  isNotCurrent: boolean
  daysInMonth: number
  dateObj: Dayjs

  useUtc: boolean

  [key: string]: unknown

  get isToday() {
    const now = $date(undefined, { utc: this.useUtc })
    const nowTime
      = now.year() * 31556926 + now.month() * 2629743 + now.date() * 86400
    const dateTime
      = this.dateObj.year() * 31556926
        + this.dateObj.month() * 2629743
        + this.dateObj.date() * 86400

    return nowTime === dateTime
  }

  get dateValue() {
    return this.dateObj.valueOf()
  }

  get isEdge() {
    // ENHANCEMENT: firstDayOfWeek
    return {
      start: {
        week: this.dayOfWeek === 1,
        month: this.dayOfMonth === 1,
      },
      end: {
        week: this.dayOfWeek === 0,
        month: this.dayOfMonth === this.daysInMonth,
      },
    }
  }

  constructor(
    date: Datetime,
    period: Period,
    options: {
      useUtc?: boolean
      holidays?: Record<string, boolean>
      extraObj?: Record<string, unknown>
    } = {},
  ) {
    const { holidays = {}, extraObj = {}, useUtc = true } = options

    this.dateObj = $date(date)
    this.dateString = this.dateObj.format('YYYY-MM-DD')
    this.dayOfMonth = this.dateObj.date()
    this.daysInMonth = this.dateObj.daysInMonth()
    this.dayOfWeek = this.dateObj.day()
    this.isWeekend = this.dayOfWeek === 0 || this.dayOfWeek === 6
    this.useUtc = useUtc

    this.isHoliday = !!holidays[this.dateString]
    this.isNotCurrent = !this.dateObj.isBetween(
      period.periodStart,
      period.periodEnd,
      'd',
      '[]',
    )

    Object.keys(extraObj).forEach(key => {
      this[key] = extraObj[key]
    })
  }
}
