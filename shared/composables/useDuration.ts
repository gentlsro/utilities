// Functions
import { useNumber } from './useNumber'
import type { INumberOptions } from './useNumber'

export type DurationUnit
  = | 'millisecond'
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

export function useDuration(payload: { localeIso?: string }) {
  const { localeIso } = payload ?? {}

  const { parseNumber, formatNumber } = useNumber({ localeIso })

  const formatDuration = (
    value?: number | string | null,
    options: IDurationOptions = {},
  ): { val: number, unit: IDurationOptions['unit'], formatted: string } => {
    let val = value

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

  function getDurationHumanParts(
    value?: number | string | null,
    options: IDurationOptions = {},
  ) {
    if (isNil(value) || value === '') {
      return []
    }

    let amount = typeof value === 'number' ? value : parseNumber(value)
    if (!Number.isFinite(amount) || amount === 0) {
      return []
    }

    const sign = amount < 0 ? '-' : ''
    amount = Math.abs(amount)

    const ms = options.unit
      ? $duration(amount, options.unit).as('ms')
      : amount

    const units: DurationUnit[] = ['day', 'hour', 'minute', 'second']
    const parts: string[] = []
    let remaining = ms

    for (const unit of units) {
      const unitMs = MODIFIER_BY_UNIT[unit]
      const count = Math.floor(remaining / unitMs)
      if (count <= 0) {
        continue
      }

      parts.push(`${padStart(String(count), 2, '0')} ${$t(`general.unit.${unit}Short`, count - 1)}`)
      remaining -= count * unitMs
    }

    if (!parts.length) {
      const count = Math.round(ms)
      parts.push(`${count} ${$t('general.millisecond', count)}`)
    }

    if (sign && parts[0]) {
      parts[0] = `${sign}${parts[0]}`
    }

    return parts
  }

  function formatDurationHuman(
    value?: number | string | null,
    options: IDurationOptions = {},
  ) {
    return getDurationHumanParts(value, options).join(' ')
  }

  return {
    formatDurationHuman,
    getDurationHumanParts,
    formatDuration,
    getDuration,
  }
}
