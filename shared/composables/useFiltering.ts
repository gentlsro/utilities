import utilsConfig from '$utilsConfig'
import { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

// Models
import type { FilterItem } from '../models/filter-item.model'

// Functions
import { useText } from './useText'
import { filterData as filterDataCore } from '../functions/filter-data'

type IFilter<T> = Pick<
  FilterItem<T>,
  | 'field'
  | 'filterField'
  | 'value'
  | 'comparator'
  | 'dataType'
  | 'filteredKeys'
  | 'filterFormat'
  | 'format'
>

export function useFiltering() {
  const { normalizeText } = useText()

  const filterData = <T extends IItem = IItem>(
    data: T[],
    filters: IFilter<T>[],
    rowKey = 'id',

    options?: {
      /**
       * When true, the function will not stop after the first invalid filter
       */
      runAll?: boolean

      /**
       * When provided, the function will be called when a filter is invalid
       */
      onInvalid?: (filter: any, row: T) => void
    },
  ) => {
    const { runAll = false, onInvalid } = options ?? {}

    return filterDataCore({
      data,
      filters,
      rowKey,
      normalizeText,
      transliterate: utilsConfig.general.transliterate,
      runAll,
      onInvalid,
    })
  }

  const handleFilter = (
    comparator: ComparatorEnum,
    rowValue: any,
    value: any,
    dataType?: ExtendedDataType,
  ) => {
    const textFnc = utilsConfig.general.transliterate
      ? transliterate
      : normalizeText

    let valid = true
    let formattedRowValue = rowValue
    let formattedValue = value

    if (dataType) {
      formattedRowValue = parseValue(rowValue, dataType, { dateFormat: 'YYYY-MM-DD' })
      formattedValue = parseValue(value, dataType, { dateFormat: 'YYYY-MM-DD' })
    }

    if (dataType === 'string' || dataType === 'stringSimple') {
      formattedRowValue = textFnc(formattedRowValue ?? '') || undefined
      formattedValue = textFnc(formattedValue ?? '') || undefined
    }

    switch (comparator) {
      case ComparatorEnum.STARTS_WITH:
        valid = valid
          && textFnc((formattedRowValue || '').toString())
            .startsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.NOT_STARTS_WITH:
        valid = valid
          && !textFnc((formattedRowValue || '').toString())
            .startsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.ENDS_WITH:
        valid = valid
          && textFnc((formattedRowValue || '').toString())
            .endsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.NOT_ENDS_WITH:
        valid = valid
          && !textFnc((formattedRowValue || '').toString())
            .endsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.GREATER_THAN:
        valid = valid && formattedRowValue > formattedValue
        break

      case ComparatorEnum.LESS_THAN:
        valid = valid && formattedRowValue < formattedValue
        break

      case ComparatorEnum.GREATER_THAN_OR_EQUAL:
        valid = valid && formattedRowValue >= formattedValue
        break

      case ComparatorEnum.LESS_THAN_OR_EQUAL:
        valid = valid && formattedRowValue <= formattedValue
        break

      case ComparatorEnum.EQUAL:
        if (dataType && DATE_TYPES.includes(dataType)) {
          return $date(rowValue).isSame($date(value), 'day')
        } else {
          valid = valid && formattedRowValue === formattedValue
        }

        break

      case ComparatorEnum.NOT_EQUAL:
        if (dataType && DATE_TYPES.includes(dataType)) {
          return !$date(rowValue).isSame($date(value), 'day')
        } else {
          valid = valid && formattedRowValue !== formattedValue
        }

        break

      case ComparatorEnum.IS_EMPTY:
        valid = valid && (Array.isArray(formattedRowValue) ? !formattedRowValue.length : isNil(formattedRowValue))
        break

      case ComparatorEnum.NOT_IS_EMPTY:
        valid = valid && (Array.isArray(formattedRowValue) ? !!formattedRowValue.length : !isNil(formattedRowValue))
        break

      case ComparatorEnum.CONTAINS:
        valid = valid
          && textFnc((formattedRowValue || '').toString())
            .includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.NOT_CONTAINS:
        valid = valid
          && !textFnc((formattedRowValue || '').toString())
            .includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.IN:
        valid = valid
          && textFnc((formattedRowValue || '').toString())
            .includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.IN_EVERY:
        valid = valid
          && Array.isArray(formattedRowValue) && Array.isArray(formattedValue)
          && formattedValue.length === formattedRowValue.length
          && formattedValue.every(val => formattedRowValue.includes(val))
          && formattedRowValue.every(val => formattedValue.includes(val))

        break

      case ComparatorEnum.NOT_IN:
      case ComparatorEnum.IN_NONE:
        valid = valid
          && !textFnc((formattedRowValue || '').toString())
            .includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.IS:
        valid = valid && formattedRowValue === formattedValue
        break

      case ComparatorEnum.NOT_IS:
        valid = valid && formattedRowValue !== formattedValue
        break

      default:
        valid = valid && formattedRowValue === formattedValue
        break
    }

    return valid
  }

  return { handleFilter, filterData }
}
