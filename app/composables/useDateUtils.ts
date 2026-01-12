import type { ManipulateType, OpUnitType } from 'dayjs'

// Models
import { DayEnum } from '../../shared/enums/day.enum'

// Functions
import {
  getDateSimpleValue as getDateSimpleValueShared,
  useDateUtils as useDateUtilsShared,
} from '../../shared/composables/useDateUtils'

export type IExtendedPeriodOptions = {
  unit?: OpUnitType | ManipulateType | 'isoWeek'
  firstDayOfWeek?: DayEnum
  minCountOfWeeks?: number
  periodRef?: MaybeRefOrGetter<Period>
  dateRef?: MaybeRefOrGetter<Datetime>
}

/**
 * Works the same way as `.valueOf()` but ignores the time part of the date
 */
export function getDateSimpleValue(dateRef: MaybeRefOrGetter<Datetime>) {
  const date = toValue(dateRef)

  return getDateSimpleValueShared(date)
}

export function useDateUtils() {
  const { currentLocale } = useLocale()
  const {
    formatDate: formatDateShared,
    formatTime: formatTimeShared,
    parseDate: parseDateShared,
    getPeriod: getPeriodShared,
    getExtendedPeriod: getExtendedPeriodShared,
    isValidRange: isValidRangeShared,
    getDaysInPeriod: getDaysInPeriodShared,

    ...other
  } = useDateUtilsShared(currentLocale.value.code)

  function formatDate(
    dateRef?: MaybeRefOrGetter<Datetime>,
    options: IDateOptions | DateFormatPreset = 'short',
  ) {
    const date = toValue(dateRef)

    return formatDateShared(date, options)
  }

  function formatTime(
    timeRef: MaybeRefOrGetter<string>,
    options: {
      appendString?: string
    } = {},
  ) {
    const time = toValue(timeRef)

    return formatTimeShared(time, options)
  }

  function parseDate(
    dateRef: MaybeRefOrGetter<Datetime>,
    options?: IDateOptions,
  ) {
    const date = toValue(dateRef)

    const { $i18n } = tryUseNuxtApp() ?? {}
    const locales = toValue($i18n?.locales) ?? []
    const usedLocaleIso = options?.localeIso ?? $i18n?.defaultLocale
    const usedLocale = locales.find(locale => locale.code === usedLocaleIso)

    return parseDateShared(
      date,
      { ...options, format: (usedLocale as any)?.dateFormat },
    )
  }

  function getPeriod(payload: IExtendedPeriodOptions) {
    const {
      dateRef = undefined,
      periodRef = undefined,
      firstDayOfWeek = DayEnum.MONDAY,
      unit = 'isoWeek',
    } = payload ?? {}

    const date = toValue(dateRef)
    const period = toValue(periodRef)

    return getPeriodShared({ date, period, firstDayOfWeek, unit })
  }

  function getExtendedPeriod(payload: IExtendedPeriodOptions) {
    const {
      dateRef = undefined,
      periodRef = undefined,
      firstDayOfWeek = DayEnum.MONDAY,
      minCountOfWeeks = 0,
      unit = 'isoWeek',
    } = payload

    const date = toValue(dateRef)
    const period = toValue(periodRef)

    return getExtendedPeriodShared({
      date,
      period,
      firstDayOfWeek,
      minCountOfWeeks,
      unit,
    })
  }

  function isValidRange(
    fromRef: MaybeRefOrGetter<Datetime>,
    toRef?: MaybeRefOrGetter<Datetime>,
  ) {
    const from = toValue(fromRef)
    const to = toValue(toRef)

    return isValidRangeShared(from, to)
  }

  function getDaysInPeriod(
    periodRef: MaybeRefOrGetter<Period>,
    options: { excludedDays?: DayEnum[], currentPeriod?: Period, utc?: boolean } = {},
  ) {
    const period = toValue(periodRef)

    return getDaysInPeriodShared(period, options)
  }

  return {
    ...other,

    formatDate,
    formatTime,
    parseDate,
    getPeriod,
    getExtendedPeriod,
    isValidRange,
    getDaysInPeriod,
  }
}
