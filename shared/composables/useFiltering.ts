import utilsConfig from '$utilsConfig'

// Types
import type { ExtendedDataType } from '$dataType'

// Models
import { ComparatorEnum } from '$comparatorEnum'
import type { FilterItem } from '../models/filter-item'

// Functions
import { useText } from './useText'
import { parseValue } from '../functions/parse-value'
import { transliterate } from '../functions/transliterate'

// Constants
import { DATE_TYPES } from '../types/datetime.type'

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

// TODO: Create worker version
export function useFiltering() {
  // Utils
  const { normalizeText } = useText()

  const filterData = <T = IItem>(
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

    return data.filter(row => {
      let valid = true

      filters.forEach(f => {
        // Prevent cycle from running unnecessarily
        if (!valid && !runAll) {
          return
        }

        if ('filteredKeys' in f && !isEmpty(f.filteredKeys)) {
          valid = !!f.filteredKeys?.[get(row, rowKey) as any]

          return
        }

        // let rowValue: any
        const rowValue = get(row, f.field)

        // if ('format' in f) {
        //   rowValue = f.filterFormat?.(row)
        //     ?? f.format?.(row, get(row, f.field))
        //     ?? get(row, f.field)
        // } else {
        //   rowValue = get(row, f.field)
        // }

        if (Array.isArray(f.value)) {
          const isAndCondition = f.comparator === ComparatorEnum.IN_EVERY || f.comparator === ComparatorEnum.IN_NONE
          let validInArray = false

          if (!isAndCondition) {
            f.value.forEach(cVal => {
              const isFilterValid = handleFilter(f.comparator, rowValue, cVal, f.dataType)

              if (!isFilterValid) {
                onInvalid?.(f, row)
              }

              validInArray = validInArray || isFilterValid
            })
          } else {
            const isFilterValid = handleFilter(f.comparator, rowValue, f.value, f.dataType)

            if (!isFilterValid) {
              onInvalid?.(f, row)
            }

            validInArray = validInArray || isFilterValid
          }

          valid = valid && validInArray
        } else {
          console.log('handleFilter', rowValue, f.value)
          const isFilterValid = handleFilter(f.comparator, rowValue, f.value, f.dataType)

          if (!isFilterValid) {
            onInvalid?.(f, row)
          }

          valid = valid && isFilterValid
        }

        return valid
      })

      return valid
    })
  }

  const handleFilter = (
    comparator: ComparatorEnum,
    rowValue: any,
    value: any,
    dataType?: ExtendedDataType,
  ) => {
    let valid = true
    let formattedRowValue = rowValue
    let formattedValue = value

    if (dataType) {
      formattedRowValue = parseValue(rowValue, dataType, { dateFormat: 'YYYY-MM-DD' })
      formattedValue = parseValue(value, dataType, { dateFormat: 'YYYY-MM-DD' })
    }

    const textFnc = utilsConfig.general.transliterate
      ? transliterate
      : normalizeText

    // Transliteration
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
        valid = valid && isNil(formattedRowValue)
        break

      case ComparatorEnum.NOT_IS_EMPTY:
        valid = valid && !isNil(formattedRowValue)
        break

      case ComparatorEnum.CONTAINS:
        console.log('contains', formattedRowValue, formattedValue)
        console.log('contains', textFnc((formattedRowValue || '').toString()), textFnc((formattedValue || '').toString()))

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
