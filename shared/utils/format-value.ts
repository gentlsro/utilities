import { utilsConfig } from '$utilsConfig'

// Types
import type { IFormatValueOptions } from '../types/format-value-options.type'

// Functions
import { predictDataType } from '../functions/predict-data-type'
import { useDateUtils as useDateUtilsShared } from '../composables/useDateUtils'
import { useNumber as useNumberShared } from '../composables/useNumber'
import { useDuration as useDurationShared } from '../composables/useDuration'

function handleDefaultFormat(payload: {
  value: any
  options: IFormatValueOptions
  dateFormat?: string
  emptyValue?: any
  predictDataType?: IFormatValueOptions['predictDataType']
  formatNumber: ReturnType<typeof useNumberShared>['formatNumber']
  getDuration: ReturnType<typeof useDurationShared>['getDuration']
  formatDate: ReturnType<typeof useDateUtilsShared>['formatDate']
  formatTime: ReturnType<typeof useDateUtilsShared>['formatTime']
}) {
  const {
    value,
    options,
    dateFormat,
    emptyValue,
    predictDataType: _predictDataType,
    formatNumber,
    getDuration,
    formatDate,
    formatTime,
  } = payload

  // We try to predict datatype if not provided
  if (_predictDataType) {
    options.dataType = predictDataType(_predictDataType)
  }

  switch (options.dataType) {
    case 'number':
    case 'numberSimple':
      return formatNumber(value)

    case 'currency':
    case 'currencySimple':
      return formatNumber(value, {
        intlOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
      })

    case 'decimal':
    case 'decimalSimple':
      return value

    case 'duration':
    case 'durationSimple':
      return getDuration(value).formattedWithUnit

    case 'date':
    case 'dateSimple':
      if (dateFormat) {
        return $date(value).format(dateFormat)
      } else {
        return formatDate(value, 'short')
      }

    case 'datetime':
    case 'datetimeSimple':
      return formatDate(value, 'long')

    case 'fullDateTime':
    case 'fullDateTimeSimple':
      return formatDate(value, 'longWithSeconds')

    case 'timestamp':
    case 'timestampSimple':
      return formatDate(value, 'timestamp')

    case 'yearMonth':
    case 'yearMonthSimple':
      return formatDate(value, 'yearMonth')

    case 'time':
    case 'timeSimple':
      return formatTime(value)

    case 'boolean':
    case 'bool':
    case 'booleanSimple':
    case 'boolSimple':
      try {
        return JSON.parse(value) ? $t('general.yes') : $t('general.no')
      } catch {
        return emptyValue
      }

    case 'string':
    case 'stringSimple':
    default:
      return value
  }
}

/**
 * Formats the value from given data type to string
 */
export function formatValue(
  value: any,
  row?: any,
  options: IFormatValueOptions = {},
): any {
  const {
    dateFormat,
    localeIso = 'en-US',
    emptyValue,
    predictDataType: _predictDataType,
    format,
  } = options ?? {}

  const { formatDate, formatTime } = useDateUtilsShared(() => localeIso)
  const { formatNumber } = useNumberShared({ localeIso })
  const { getDuration } = useDurationShared({ localeIso })

  // When array is provided, we format each value
  if (Array.isArray(value)) {
    return value
      .map(val => formatValue(val, row, options))
      .join(', ') as string
  }

  // When `value` is equal to the `emptyValue`, we just return it
  if (isEqual(value, emptyValue)) {
    return emptyValue
  }
  // When value is null or undefined, we don't bother and just return empty string
  if (isNil(value)) {
    return ''
  }

  // When format function is provided, we use that
  if (format) {
    return format(row ?? {}, value, options)
  }

  const defaultFormatPayload = {
    value,
    options,
    dateFormat,
    emptyValue,
    predictDataType: _predictDataType,
    formatNumber,
    getDuration,
    formatDate,
    formatTime,
  }

  // In case we have a custom format function, we use that
  const _dataType = options.dataType as keyof typeof utilsConfig.dataTypeExtend.formatFncByDataType
  const customFormatFnc = _dataType && utilsConfig.dataTypeExtend.formatFncByDataType[_dataType]

  if (customFormatFnc) {
    return customFormatFnc(value, row, {
      ...options,
      formatFnc: formatValue,
      defaultHandler: () => handleDefaultFormat(defaultFormatPayload),
    })
  }

  return handleDefaultFormat(defaultFormatPayload)
}
