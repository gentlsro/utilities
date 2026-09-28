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
    /**
     * Compared as calendar dates: `dateString` is the date this day represents
     * (`utc` days represent UTC dates), while "today" is always the day the
     * user is living in ~ UTC "now" is a different day for part of every day.
     */
    return this.dateString === $date().format('YYYY-MM-DD')
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

    this.dateObj = $date(date, { utc: useUtc })
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
