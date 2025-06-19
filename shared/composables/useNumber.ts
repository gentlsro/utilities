// Models
import { SummaryEnum } from '../enums/summary.enum'

// Regex
import { stringToFloat } from '../regex/string-to-float.regex'

export type INumberOptions = {
  localeIso?: string
  intlOptions?: Intl.NumberFormatOptions
}

const defaultIntlOptions: Intl.NumberFormatOptions = {
  maximumFractionDigits: 2,
  useGrouping: true,
}

export function useNumber(localeIso: string) {
  const separators = computed(() => getSeparators(localeIso))

  const summaryMetricOptions = computed(() => {
    return [
      { id: SummaryEnum.SUM, label: $t(`summaryEnum.${SummaryEnum.SUM}`) },
      { id: SummaryEnum.AVERAGE, label: $t(`summaryEnum.${SummaryEnum.AVERAGE}`) },
      { id: SummaryEnum.MEDIAN, label: $t(`summaryEnum.${SummaryEnum.MEDIAN}`) },
      { id: SummaryEnum.COUNT, label: $t(`summaryEnum.${SummaryEnum.COUNT}`) },
    ]
  })

  /**
   * Parses a number from a string
   *
   * Respects locale (thousand separator, decimal separator)
   */
  const parseNumber = (valueRef?: MaybeRefOrGetter<string | number | null>) => {
    const val = String(toValue(valueRef))
    if (!val) {
      return 0
    }

    let result = val
      .replace(new RegExp(`\\${separators.value.thousandSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${separators.value.decimalSeparator}`), '.')

    if (separators.value.thousandSeparator.charCodeAt(0) === 160) {
      result = result.replace(/ /g, '')
    }
    result = stringToFloat(result) || '0'

    return Number.isNaN(+result) ? 0 : +result
  }

  /**
   * Formats a number to a locale-aware string
   */
  const formatNumber = (
    valueRef?: MaybeRefOrGetter<number | string | null>,
    options: INumberOptions = {},
  ) => {
    const val = toValue(valueRef)
    if (val === null || val === undefined) {
      return ''
    }

    const usedLocale = options.localeIso || localeIso
    const usedIntlOptions = options.intlOptions || defaultIntlOptions

    if (typeof val === 'string') {
      return Intl.NumberFormat(usedLocale, usedIntlOptions).format(parseNumber(val))
    }

    return Intl.NumberFormat(usedLocale, usedIntlOptions).format(+val)
  }

  /**
   * Formats currency
   */
  function formatCurrency(
    valueRef?: MaybeRefOrGetter<number | string | null>,
    currency?: string,
    options: INumberOptions = {},
  ) {
    const val = toValue(valueRef)

    if (val === null || val === undefined) {
      return ''
    }

    const formattedNumber = formatNumber(valueRef, {
      ...options,
      intlOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    })

    return currency ? `${formattedNumber} ${currency}` : formattedNumber
  }

  /**
   * Formats bytes into more readable format
   */
  function formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 B'
    }

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${formatNumber(bytes / k ** i)} ${sizes[i]}`
  }

  function getSeparators(localeRef?: MaybeRefOrGetter<string>) {
    const locale = toValue(localeRef) || localeIso

    const helperVal = Intl.NumberFormat(locale).formatToParts(1111.1)
    const thousandSeparator = helperVal[1]!.value
    const decimalSeparator = helperVal[3]!.value

    return {
      thousandSeparator,
      decimalSeparator,
    }
  }

  return {
    separators,
    summaryMetricOptions,
    getSeparators,
    parseNumber,
    formatNumber,
    formatBytes,
    formatCurrency,
  }
}
