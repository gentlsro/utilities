import utilsConfig from '$utilsConfig'
import type { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

// Functions
import { predictDataType } from '../functions/predict-data-type'

// The default handler for parsing values
function handleParseValue(payload: {
  value: any
  dataType?: ExtendedDataType
  options?: {
    dateFormat?: string
    timezone?: string
    comparator?: ComparatorEnum
    predictDataType?: PredictDataTypeOptions
  }
}) {
  let { value, dataType, options } = payload
  const { dateFormat, predictDataType: _predictDataType, timezone } = options || {}

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
          ? $date(value).tz(timezone).format(dateFormat)
          : $date(value).format(dateFormat)
        : $date(value)

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

/**
 * Will parse value from string to the given data type
 */
export function parseValue(
  value: any,
  dataType?: ExtendedDataType,
  options?: {
    /**
     * Output date format
     */
    dateFormat?: string

    /**
     * Timezone to use for the date output
     */
    timezone?: string

    /**
     * In some special cases, the parsing can be based on the comparator
     */
    comparator?: ComparatorEnum

    /**
     * When true, the function will try to guess the data type based on the value
     */
    predictDataType?: PredictDataTypeOptions
  },
) {
  const { predictDataType: _predictDataType } = options || {}

  if (isNil(value)) {
    return value
  }

  // In case we have a custom format function, we use that
  const _dataType = dataType as keyof typeof utilsConfig.dataTypeExtend.parseFncByDataType
  const customFormatFnc = dataType && utilsConfig.dataTypeExtend.parseFncByDataType[_dataType]

  if (customFormatFnc) {
    return customFormatFnc({
      value,
      dataType,
      options,
      defaultHandler: handleParseValue,
    })
  }

  return handleParseValue({ value, dataType, options })
}
