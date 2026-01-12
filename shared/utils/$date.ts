// Using dayjs/esm build for proper ESM support in Nuxt layers
// https://github.com/iamkun/dayjs/issues/1765
import dayjs from 'dayjs/esm'
import duration from 'dayjs/esm/plugin/duration'
import customParseFormat from 'dayjs/esm/plugin/customParseFormat'
import isBetween from 'dayjs/esm/plugin/isBetween'
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore'
import isoWeek from 'dayjs/esm/plugin/isoWeek'
import dayOfYear from 'dayjs/esm/plugin/dayOfYear'
import utc from 'dayjs/esm/plugin/utc'
import timezone from 'dayjs/esm/plugin/timezone'
import quarterOfYear from 'dayjs/esm/plugin/quarterOfYear'
import 'dayjs/esm/locale/en-gb'
import 'dayjs/esm/locale/cs'

dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isoWeek)
dayjs.extend(dayOfYear)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(quarterOfYear)

export { dayjs }

export function $date(
  date?: Datetime,
  format?: dayjs.OptionType,
  strict?: boolean,
) {
  let isUtc = true

  if (typeof format === 'object' && 'utc' in format) {
    isUtc = format.utc ?? true
  }

  if (isUtc) {
    // @ts-expect-error - dayjs.utc() is not typed
    return dayjs.utc(date, format, strict)
  }

  return dayjs(date, format, strict)
}

export const $duration = dayjs.duration

export type Dayjs = ReturnType<typeof dayjs>
