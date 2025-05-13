import utilsConfig from '$utilsConfig'
import type { ExtendedDataType } from '$dataType'

// Types
import type { PredictDataTypeOptions } from '../types/predict-data-type-options.type'

// Functions
import { predictDataType } from './predict-data-type'

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
     * When true, the function will try to guess the data type based on the value
     */
    predictDataType?: PredictDataTypeOptions
  },
) {
  const { dateFormat, predictDataType: _predictDataType, timezone } = options || {}

  if (isNil(value)) {
    return value
  }

  // In case we have a custom format function, we use that
  const _dataType = dataType as keyof typeof utilsConfig.dataTypeExtend.parseFncByDataType
  const customFormatFnc = dataType && utilsConfig.dataTypeExtend.parseFncByDataType[_dataType]

  if (customFormatFnc) {
    return customFormatFnc(value)
  }

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
