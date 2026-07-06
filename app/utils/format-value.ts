import utilsConfig from '$utilsConfig'

// Types
import type { IFormatValueOptions } from '../types/format-value-options.type'

// Functions
import { predictDataType } from '../functions/predict-data-type'
import { useDateUtils } from '../composables/useDateUtils'
import { useNumber } from '../composables/useNumber'
import { useDuration } from '../composables/useDuration'

function handleDefaultFormat(payload: {
  value: any
  options: IFormatValueOptions
  dateFormat?: string
  emptyValue?: any
  predictDataType?: IFormatValueOptions['predictDataType']
  formatNumber: ReturnType<typeof useNumber>['formatNumber']
  getDuration: ReturnType<typeof useDuration>['getDuration']
  formatDate: ReturnType<typeof useDateUtils>['formatDate']
  formatTime: ReturnType<typeof useDateUtils>['formatTime']
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

export function formatValue(
  value: any,
  row?: any,
  options: IFormatValueOptions = {},
): any {
  const rC = useRuntimeConfig()
  options.formatFncByDataType ??= utilsConfig.dataTypeExtend.formatFncByDataType
  options.useUtc ??= rC.public.useUtc === 'true'

  const {
    dateFormat,
    localeIso = 'en-US',
    emptyValue,
    predictDataType: _predictDataType,
    format,
    formatFncByDataType = {},
    useUtc,
  } = options

  const { formatDate, formatTime } = useDateUtils({ localeIso })
  const { formatNumber } = useNumber({ localeIso })
  const { getDuration } = useDuration({ localeIso })

  if (Array.isArray(value)) {
    return value
      .map(val => formatValue(val, row, options))
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
      formatFnc: formatValue,
      defaultHandler: () => handleDefaultFormat(defaultFormatPayload),
    })
  }

  return handleDefaultFormat(defaultFormatPayload)
}
