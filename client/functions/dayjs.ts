import utilsConfig from '$utilsConfig'
import type { OptionType } from 'dayjs'

export function $date(
  date?: Datetime,
  format?: OptionType,
  strict?: boolean,
) {
  const dayjs = useDayjs()
  let isUtc: boolean = utilsConfig.general.useUtc

  if (typeof format === 'object' && 'utc' in format) {
    isUtc = format.utc ?? utilsConfig.general.useUtc
  }

  if (isUtc) {
    return dayjs.utc(date ?? undefined, format as any, strict)
  }

  return dayjs(date ?? undefined, format, strict)
}

export const $duration = useDayjs().duration
