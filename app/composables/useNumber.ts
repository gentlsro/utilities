// Regex
import { stringToFloat } from '../../shared/regex/string-to-float.regex'

// Enums
import { SummaryEnum } from '../enums/summary.enum'

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export type INumberOptions = {
  localeIso?: string
  intlOptions?: Intl.NumberFormatOptions
}

const defaultIntlOptions: Intl.NumberFormatOptions = {
  maximumFractionDigits: 2,
  useGrouping: true,
}

function getSeparators(localeRef?: MaybeRefOrGetter<string>) {
  const locale = toValue(localeRef)

  const helperVal = Intl.NumberFormat(locale).formatToParts(1111.1)
  const thousandSeparator = helperVal[1]!.value
  const decimalSeparator = helperVal[3]!.value

  return {
    thousandSeparator,
    decimalSeparator,
  }
}

function createNumberUtils(payload: {
  localeIso?: string
  separators?: {
    thousandSeparator: string
    decimalSeparator: string
  }
}) {
  const { localeIso, separators = { thousandSeparator: '', decimalSeparator: '' } } = payload ?? {}

  /**
   * Parses a number from a string
   *
   * Respects locale (thousand separator, decimal separator)
   */
  const parseNumber = (value?: string | number | null) => {
    const val = String(value)
    if (!val) {
      return 0
    }

    let result = val
      .replace(new RegExp(escapeRegExp(separators.thousandSeparator), 'g'), '')
      .replace(new RegExp(escapeRegExp(separators.decimalSeparator)), '.')

    if (separators.thousandSeparator.charCodeAt(0) === 160) {
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
    const value = toValue(valueRef)

    if (value === null || value === undefined) {
      return ''
    }

    const usedLocale = options.localeIso || localeIso
    const usedIntlOptions = options.intlOptions || defaultIntlOptions

    if (typeof value === 'string') {
      return Intl.NumberFormat(usedLocale, usedIntlOptions).format(parseNumber(value))
    }

    return Intl.NumberFormat(usedLocale, usedIntlOptions).format(+value)
  }

  /**
   * Formats currency
   */
  function formatCurrency(
    valueRef?: MaybeRefOrGetter<number | string | null>,
    currency?: string,
    options: INumberOptions = {},
  ) {
    const value = toValue(valueRef)

    if (value === null || value === undefined) {
      return ''
    }

    const formattedNumber = formatNumber(value, {
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

  return {
    parseNumber,
    formatNumber,
    formatBytes,
    formatCurrency,
  }
}

export function useNumber(options?: { localeIso?: string }) {
  const { localeIso: providedLocaleIso } = options ?? {}

  if (providedLocaleIso) {
    const separators = computed(() => getSeparators(providedLocaleIso))

    return {
      ...createNumberUtils({
        localeIso: providedLocaleIso,
        separators: separators.value,
      }),
      separators,
      getSeparators,
    }
  }

  const { currentLocale } = useLocale()
  const separators = computed(() => getSeparators(currentLocale.value.code))

  const summaryMetricOptions = computed(() => {
    return [
      { id: SummaryEnum.SUM, label: $t(`summaryEnum.${SummaryEnum.SUM}`) },
      { id: SummaryEnum.AVERAGE, label: $t(`summaryEnum.${SummaryEnum.AVERAGE}`) },
      { id: SummaryEnum.MEDIAN, label: $t(`summaryEnum.${SummaryEnum.MEDIAN}`) },
      { id: SummaryEnum.COUNT, label: $t(`summaryEnum.${SummaryEnum.COUNT}`) },
    ]
  })

  return {
    ...createNumberUtils({
      localeIso: currentLocale.value.code,
      separators: separators.value,
    }),
    separators,
    summaryMetricOptions,
    getSeparators,
  }
}
