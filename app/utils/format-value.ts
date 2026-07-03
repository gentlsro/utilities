import utilsConfig from '$utilsConfig'

// Types
import type { IFormatValueOptions } from '../types/format-value-options.type'

// Functions
import { predictDataType } from '../functions/predict-data-type'
import { useDateUtilsCore } from '../composables/useDateUtils'
import { useNumberCore } from '../composables/useNumber'
import { useDurationCore } from '../composables/useDuration'

function handleDefaultFormat(payload: {
  value: any
  options: IFormatValueOptions
  dateFormat?: string
  emptyValue?: any
  predictDataType?: IFormatValueOptions['predictDataType']
  formatNumber: ReturnType<typeof useNumberCore>['formatNumber']
  getDuration: ReturnType<typeof useDurationCore>['getDuration']
  formatDate: ReturnType<typeof useDateUtilsCore>['formatDate']
  formatTime: ReturnType<typeof useDateUtilsCore>['formatTime']
  useUtc?: boolean
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
    useUtc,
  } = payload

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
        return $date(value, { utc: useUtc }).format(dateFormat)
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
        return JSON.parse(value) ? $tShared('general.yes') : $tShared('general.no')
      } catch {
        return emptyValue
      }

    case 'string':
    case 'stringSimple':
    default:
      return value
  }
}

export function formatValueCore(
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
    formatFncByDataType = {},
    useUtc,
  } = options ?? {}

  const { formatDate, formatTime } = useDateUtilsCore(localeIso)
  const { formatNumber } = useNumberCore({ localeIso })
  const { getDuration } = useDurationCore({ localeIso })

  if (Array.isArray(value)) {
    return value
      .map(val => formatValueCore(val, row, options))
      .join(', ') as string
  }

  if (isEqual(value, emptyValue)) {
    return emptyValue
  }
  if (isNil(value)) {
    return ''
  }

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
    useUtc,
  }

  const _dataType = options.dataType as keyof typeof formatFncByDataType
  const customFormatFnc = _dataType && formatFncByDataType[_dataType]

  if (customFormatFnc) {
    return customFormatFnc(value, row, {
      ...options,
      formatFnc: formatValueCore,
      defaultHandler: () => handleDefaultFormat(defaultFormatPayload),
    })
  }

  return handleDefaultFormat(defaultFormatPayload)
}

export function formatValue(...args: Parameters<typeof formatValueCore>) {
  const [value, row, options = {}] = args

  options.formatFncByDataType ??= utilsConfig.dataTypeExtend.formatFncByDataType
  options.useUtc ??= utilsConfig.general.useUtc

  return formatValueCore(value, row, options)
}
