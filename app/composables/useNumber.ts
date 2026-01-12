import { SummaryEnum } from '../../shared/enums/summary.enum'

// Types
import type { INumberOptions } from '../../shared/composables/useNumber'

// Functions
import { useNumber as useNumberShared } from '../../shared/composables/useNumber'

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

export function useNumber(options?: { localeIso?: string }) {
  const { localeIso } = options ?? {}
  const { currentLocale } = useLocale()

  const {
    formatNumber: formatNumberShared,
    formatCurrency: formatCurrencyShared,

    ...other
  } = useNumberShared({ localeIso: currentLocale.value.code })

  const separators = computed(() => getSeparators(localeIso ?? currentLocale.value.code))

  const summaryMetricOptions = computed(() => {
    return [
      { id: SummaryEnum.SUM, label: $t(`summaryEnum.${SummaryEnum.SUM}`) },
      { id: SummaryEnum.AVERAGE, label: $t(`summaryEnum.${SummaryEnum.AVERAGE}`) },
      { id: SummaryEnum.MEDIAN, label: $t(`summaryEnum.${SummaryEnum.MEDIAN}`) },
      { id: SummaryEnum.COUNT, label: $t(`summaryEnum.${SummaryEnum.COUNT}`) },
    ]
  })

  function formatNumber(
    valueRef?: MaybeRefOrGetter<number | string | null>,
    options: INumberOptions = {},
  ) {
    const value = toValue(valueRef)

    return formatNumberShared(value, options)
  }

  function formatCurrency(
    valueRef?: MaybeRefOrGetter<number | string | null>,
    currency?: string,
    options: INumberOptions = {},
  ) {
    const value = toValue(valueRef)

    return formatCurrencyShared(value, currency, options)
  }

  return {
    ...other,

    formatNumber,
    formatCurrency,
    separators,
    summaryMetricOptions,
    getSeparators,
  }
}
