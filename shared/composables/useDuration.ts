// Functions
import type { INumberOptions } from './useNumber'
import { useNumber } from './useNumber'

export type DurationUnit =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'

export type IDurationOptions = INumberOptions & { unit?: DurationUnit }

export const MODIFIER_BY_UNIT: Record<DurationUnit, number> = {
  millisecond: 1,
  second: $duration(1, 'second').as('ms'),
  minute: $duration(1, 'minute').as('ms'),
  hour: $duration(1, 'hour').as('ms'),
  day: $duration(1, 'day').as('ms'),
  week: $duration(1, 'week').as('ms'),
  month: $duration(1, 'month').as('ms'),
  year: $duration(1, 'year').as('ms'),
}

export function useDuration(localeIso: string) {
  const { parseNumber, formatNumber } = useNumber(localeIso)

  const formatDuration = (
    valueRef?: MaybeRefOrGetter<number | string | null>,
    options: IDurationOptions = {},
  ): { val: number, unit: IDurationOptions['unit'], formatted: string } => {
    let val = toValue(valueRef)

    if (isNil(val) || val === '') {
      return {
        val: 0,
        unit: 'second',
        formatted: '',
      }
    }

    if (typeof val !== 'number') {
      val = parseNumber(val)
    }

    return getDuration(val, options.unit)
  }

  const getDuration = (
    value: number,
    unit?: IDurationOptions['unit'],
  ): {
    val: number
    unit: IDurationOptions['unit']
    formatted: string
    formattedWithUnit: string
  } => {
    const valueAbs = Math.abs(value)

    if (!unit) {
      if ($duration(valueAbs).as('second') <= 1) {
        unit = 'millisecond'
      } else if ($duration(valueAbs).as('second') <= 30) {
        unit = 'second'
      } else if ($duration(valueAbs).as('minute') <= 30) {
        unit = 'minute'
      } else if ($duration(valueAbs).as('hour') < 24) {
        unit = 'hour'
      } else {
        unit = 'day'
      }
    }

    const val = $duration(value).as(unit)
    const formatted = formatNumber(val)
    const unitTranslated = $t(`general.${unit}`, Math.round(Math.abs(val)))

    return {
      val,
      unit,
      formatted,
      formattedWithUnit: `${formatted} ${unitTranslated}`,
    }
  }

  return {
    formatDuration,
    getDuration,
  }
}
