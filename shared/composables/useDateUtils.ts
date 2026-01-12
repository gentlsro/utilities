import type { ManipulateType, OpUnitType } from 'dayjs'

// Types
import type { Period } from '../types/period.type'

// Models
import { Day } from '../models/day.model'
import { DayEnum } from '../enums/day.enum'

// Functions
import { removeDatetimeSpaces } from '../functions/remove-datetime-spaces'

// Constants
import { datetimeFormats } from '../i18n'

export type IExtendedPeriodOptions = {
  unit?: OpUnitType | ManipulateType | 'isoWeek'
  firstDayOfWeek?: DayEnum
  minCountOfWeeks?: number
  period?: Period
  date?: Datetime
}

/**
 * Works the same way as `.valueOf()` but ignores the time part of the date
 */
export function getDateSimpleValue(date: Datetime) {
  return $date(date).startOf('day').valueOf()
}

export function useDateUtils(localeIso: string) {
  const localeUses24HourTime = () => {
    return (
      new Intl.DateTimeFormat(localeIso, { hour: 'numeric' })
        .formatToParts(new Date(2020, 0, 1, 13))
        .find(part => part.type === 'hour')
        ?.value
        .length === 2
    )
  }

  const formatDate = (
    date?: Datetime,
    options: IDateOptions | DateFormatPreset = 'short',
  ) => {
    if (typeof date === 'string') {
      date = date.trim()
    }

    // When using a predefined format, we use the corresponding Intl API
    if (typeof options === 'string') {
      const parsedDate = parseDate(date)

      if (!parsedDate.isValid()) {
        return ''
      }

      const isPredefinedFormat = datetimeFormats[options]

      if (isPredefinedFormat) {
        return Intl.DateTimeFormat(localeIso, datetimeFormats[options])
          .format(parsedDate.valueOf())
          .replace(/(\d{2})\.\s(\d{2})\.\s(\d{4})/g, '$1.$2.$3')
      } else {
        return parsedDate
          .format(options)
          .replace(/(\d{2})\.\s(\d{2})\.\s(\d{4})/g, '$1.$2.$3')
      }
    }

    // Otherwise we use the Intl API
    else {
      const { outputIntlOptions } = options
      const usedLocaleIso = options?.localeIso ?? localeIso
      const parsedDate = parseDate(date, options)

      if (!parsedDate.isValid()) {
        return ''
      }

      // When using a predefined format, we use the corresponding Intl API
      if (
        typeof outputIntlOptions === 'string'
        && datetimeFormats[outputIntlOptions]
      ) {
        const formattedDate = Intl.DateTimeFormat(usedLocaleIso, datetimeFormats[outputIntlOptions])
          .format(parsedDate.valueOf())

        return options?.removeSpaces
          ? removeDatetimeSpaces(formattedDate)
          : formattedDate
      }

      // When using an explicit format, we use the dayjs API
      else if (typeof outputIntlOptions === 'string') {
        return parsedDate.format(outputIntlOptions)
      }

      const formattedDate = Intl.DateTimeFormat(usedLocaleIso, outputIntlOptions)
        .format(parsedDate.valueOf())

      return options?.removeSpaces
        ? removeDatetimeSpaces(formattedDate)
        : formattedDate
    }
  }

  const formatTime = (
    time: string,
    options: {
      appendString?: string
    } = {},
  ) => {
    const { appendString = '' } = options

    return formatDate(
      `2020-01-01 ${time} ${appendString}`,
      { outputIntlOptions: 'time' },
    )
  }

  const parseDate = (
    date: Datetime,
    options?: IDateOptions,
  ) => {
    return options?.isLocalString
      ? $date(date, options?.format)
      : $date(date)
  }

  const getPeriod = (payload: IExtendedPeriodOptions = {}): Period => {
    const {
      date = undefined,
      period = undefined,
      firstDayOfWeek = DayEnum.MONDAY,
      unit = 'isoWeek' as ManipulateType,
    } = payload

    let periodStart = period?.periodStart || date
    const periodStartObj = $date(periodStart)?.startOf(unit)

    if (unit === 'isoWeek' || unit.startsWith('w')) {
      const firstDayOfWeekIdx = periodStartObj.day() < firstDayOfWeek
        ? firstDayOfWeek - 7
        : firstDayOfWeek
      periodStart = periodStartObj.day(firstDayOfWeekIdx)
    }

    return {
      periodStart: periodStartObj,
      periodEnd: periodStartObj.add(1, unit as ManipulateType).subtract(1),
    }
  }

  const getExtendedPeriod = (payload: IExtendedPeriodOptions = {}): Period => {
    let {
      date = undefined,
      period = undefined,
      firstDayOfWeek = DayEnum.MONDAY,
      unit = 'isoWeek' as ManipulateType,
      minCountOfWeeks = 6,
    } = payload

    const periodStart = period?.periodStart || date
    const periodEnd = period?.periodEnd || date

    const periodStartObj = $date(periodStart)?.startOf(unit)
    const periodEndObj = $date(periodEnd)?.endOf(unit)

    const periodStartExtendedDayIdx
      = periodStartObj.day() < firstDayOfWeek ? firstDayOfWeek - 7 : firstDayOfWeek
    const periodStartExtended = periodStartObj.day(periodStartExtendedDayIdx)
    let periodEndExtended = periodEndObj.day() ? periodEndObj.day(7) : periodEndObj
    const diff = periodEndExtended.diff(periodStartExtended, 'day')

    minCountOfWeeks = Math.max(minCountOfWeeks, Math.ceil(diff / 7))
    periodEndExtended = periodEndExtended.add(
      minCountOfWeeks * 7 - 1 - diff,
      'day',
    )

    return { periodStart: periodStartExtended, periodEnd: periodEndExtended }
  }

  const getDaysInPeriod = (
    period: Period,
    options: { excludedDays?: DayEnum[], currentPeriod?: Period, utc?: boolean } = {},
  ) => {
    const { excludedDays, currentPeriod, utc } = options
    const days: Day[] = []
    let current = period.periodStart

    while (current.isSameOrBefore(period.periodEnd)) {
      const day = new Day(current, currentPeriod || period, { useUtc: utc })

      if (!excludedDays?.includes(day.dayOfWeek)) {
        days.push(day)
      }

      current = current.add(1, 'day')
    }

    return days
  }

  /**
   * Checks if the given `from` and `to` dates make sense ~ `fromRef` must be
   * before `toRef` and both must be before the current date.
   */
  const isValidRange = (
    from: Datetime,
    to?: Datetime,
  ) => {
    // If no `to` date is provided, we assume that the `from` date is valid
    if (!to) {
      return true
    }

    return $date(from).isSameOrBefore($date(to))
  }

  return {
    localeUses24HourTime,
    getExtendedPeriod,
    getDaysInPeriod,
    getPeriod,
    formatDate,
    formatTime,
    parseDate,
    isValidRange,
  }
}
