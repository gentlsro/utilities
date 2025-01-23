// Types
import type { ExtendedDataType } from '$dataType'

// Functions
import { predictDataType, type PredictDataTypeOptions } from './predict-data-type'

/**
 * Will parse value from string to the given data type
 */
export function parseValue(
  value: any,
  dataType?: ExtendedDataType,
  options?: {
    dateFormat?: string
    predictDataType?: PredictDataTypeOptions
  },
) {
  const { dateFormat, predictDataType: _predictDataType } = options || {}

  if (!dataType && _predictDataType) {
    const predictedDataType = predictDataType(_predictDataType)

    dataType = predictedDataType
  }

  dataType = dataType?.replace(/Simple$/, '') as ExtendedDataType

  if (isNil(value)) {
    return value
  }

  switch (dataType) {
    case 'number':
    case 'percent':
      return Number(value)

    case 'date':
    case 'datetime':
    case 'timestamp':
    case 'yearMonth':
      return dateFormat ? $date(value).format(dateFormat) : $date(value)

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
