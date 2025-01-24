import type { OptionType } from 'dayjs'

export function $date(
  date?: Datetime,
  format?: OptionType,
  strict?: boolean,
) {
  const dayjs = useDayjs()
  let isUtc = true

  if (typeof format === 'object' && 'utc' in format) {
    isUtc = format.utc ?? true
  }

  if (isUtc) {
    return dayjs.utc(date ?? undefined, format as any, strict)
  }

  return dayjs(date ?? undefined, format, strict)
}

export const $duration = useDayjs().duration
