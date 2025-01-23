// Types
import type { ExtendedDataType } from '$dataType'

// Functions
import { isNumeric } from './is-numeric'
import { isValidDate } from './is-valid-date'
import { isBooleanish } from './is-booleanish'

export type PredictDataTypeOptions<T extends IItem = IItem> = {
  rows: T[]
  field: string
  useSimple?: boolean
}

export function predictDataType(
  options: PredictDataTypeOptions,
): ExtendedDataType {
  const { field, rows, useSimple } = options

  return (
    rows.reduce<ExtendedDataType>((dataType, row) => {
      const rowValue = get(row, field)

      if (isNil(rowValue) || !isNil(dataType)) {
        return dataType
      }

      // Check for numbers
      const _isNumeric = isNumeric(rowValue)

      if (_isNumeric) {
        dataType = useSimple ? 'numberSimple' : 'number'

        return dataType
      }

      // Check for dates
      const _isDate = isValidDate(rowValue)

      if (_isDate) {
        dataType = useSimple ? 'dateSimple' : 'date'

        return dataType
      }

      // Check for booleans
      const _isBoolean = isBooleanish(rowValue)

      if (_isBoolean) {
        dataType = useSimple ? 'booleanSimple' : 'boolean'

        return dataType
      }

      return dataType
    }, null as unknown as ExtendedDataType) || 'string'
  )
}
