import type { ExtendedDataType } from '$dataType'
import utilsConfig from '$utilsConfig'

// Functions
import { predictDataType } from '../functions/predict-data-type'

function handleParseValue(payload: {
  value: any
  dataType?: ExtendedDataType
  options?: {
    dateFormat?: string
    timezone?: string
    predictDataType?: PredictDataTypeOptions
    useUtc?: boolean
  }
}) {
  // eslint-disable-next-line prefer-const
  let { value, dataType, options } = payload
  const { dateFormat, predictDataType: _predictDataType, timezone, useUtc } = options || {}

  if (!dataType && _predictDataType) {
    const predictedDataType = predictDataType(_predictDataType)

    dataType = predictedDataType
  }

  dataType = dataType?.replace(/Simple$/, '') as ExtendedDataType

  switch (dataType) {
    case 'number':
    case 'percent':
      return Number(value)

    case 'date':
    case 'datetime':
    case 'timestamp':
    case 'yearMonth':
      return dateFormat
        ? timezone
          ? $date(value, { utc: useUtc }).tz(timezone).format(dateFormat)
          : $date(value, { utc: useUtc }).format(dateFormat)
        : $date(value, { utc: useUtc })

    case 'boolean':
      if (typeof value === 'boolean') {
        return value
      } else if (value === 'true') {
        return true
      } else if (value === 'false') {
        return false
      } else if (value === 'null') {
        return null
      }

      return

    case 'string':
    case 'time':
    default:
      return value
  }
}

export function parseValueCore(
  value: any,
  dataType?: ExtendedDataType,
  options?: {
    dateFormat?: string
    timezone?: string
    predictDataType?: PredictDataTypeOptions
    useUtc?: boolean
    additionalData?: any
    parseFncByDataType?: Partial<Record<ExtendedDataType, (payload: {
      value: any
      dataType?: ExtendedDataType
      options?: any
      defaultHandler?: () => any
    }) => any>>
  },
) {
  const { predictDataType: _predictDataType } = options || {}

  if (isNil(value)) {
    return value
  }

  const parseFncByDataType = options?.parseFncByDataType ?? {}
  const _dataType = dataType as keyof typeof parseFncByDataType
  const customParseFnc = dataType && parseFncByDataType[_dataType]

  if (customParseFnc) {
    return customParseFnc({
      value,
      dataType,
      options,
      defaultHandler: () => handleParseValue({ value, dataType, options }),
    })
  }

  return handleParseValue({ value, dataType, options })
}

export function parseValue(...args: Parameters<typeof parseValueCore>) {
  const [value, dataType, options = {}] = args

  options.parseFncByDataType ??= utilsConfig.dataTypeExtend.parseFncByDataType
  options.useUtc ??= utilsConfig.general.useUtc

  return parseValueCore(value, dataType, options)
}
