import dayjs from 'dayjs/esm'
import { get, isEmpty, isNil } from 'lodash-es'
import { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

// Functions
import { transliterate } from './transliterate'

const DATE_TYPES: ExtendedDataType[] = [
  'date',
  'datetime',
  'yearMonth',
  'timestamp',
  'fullDateTime',
]

export type IFilterDataItem<T extends IItem = IItem> = {
  field: ObjectKey<T>
  filterField?: ObjectKey<T>
  value?: any
  comparator: ComparatorEnum
  dataType?: ExtendedDataType
  filteredKeys?: Record<string | number, boolean>
  filterFormat?: (row: T) => string | number | boolean
  format?: (row: T, value?: any) => string | number | boolean
}

type IFilterDataOptions<T extends IItem> = {
  data: T[]
  filters: IFilterDataItem<T>[]
  rowKey?: string
  transliterate?: boolean
  normalizeText: (text: string) => string
  runAll?: boolean
  onInvalid?: (filter: IFilterDataItem<T>, row: T) => void
}

function parseFilterValue(value: any, dataType?: ExtendedDataType) {
  if (isNil(value)) {
    return value
  }

  const normalizedDataType = dataType?.replace(/Simple$/, '') as ExtendedDataType | undefined

  switch (normalizedDataType) {
    case 'number':
    case 'percent':
      return Number(value)

    case 'date':
    case 'datetime':
    case 'timestamp':
    case 'yearMonth':
      return dayjs(value)

    case 'boolean':
      if (typeof value === 'boolean') {
        return value
      }

      if (value === 'true') {
        return true
      }

      if (value === 'false') {
        return false
      }

      if (value === 'null') {
        return null
      }

      return

    case 'string':
    case 'time':
    default:
      return value
  }
}

function handleFilterData(
  payload: {
    comparator: ComparatorEnum
    rowValue: any
    value: any
    dataType?: ExtendedDataType
    textFnc: (text: string) => string
  },
) {
  const { comparator, rowValue, value, dataType, textFnc } = payload
  let valid = true
  let formattedRowValue = rowValue
  let formattedValue = value

  if (dataType) {
    formattedRowValue = parseFilterValue(rowValue, dataType)
    formattedValue = parseFilterValue(value, dataType)
  }

  if (dataType === 'string' || dataType === 'stringSimple') {
    formattedRowValue = textFnc((formattedRowValue ?? '').toString()) || undefined
    formattedValue = textFnc((formattedValue ?? '').toString()) || undefined
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
        return dayjs(rowValue).isSame(dayjs(value), 'day')
      }

      valid = valid && formattedRowValue === formattedValue
      break

    case ComparatorEnum.NOT_EQUAL:
      if (dataType && DATE_TYPES.includes(dataType)) {
        return !dayjs(rowValue).isSame(dayjs(value), 'day')
      }

      valid = valid && formattedRowValue !== formattedValue
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

export function filterData<T extends IItem = IItem>(options: IFilterDataOptions<T>) {
  const {
    data,
    filters,
    rowKey = 'id',
    transliterate: useTransliterate = false,
    normalizeText,
    runAll = false,
    onInvalid,
  } = options

  const textFnc = useTransliterate ? transliterate : normalizeText

  return data.filter(row => {
    let valid = true

    filters.forEach(filter => {
      if (!valid && !runAll) {
        return
      }

      if (filter.filteredKeys && !isEmpty(filter.filteredKeys)) {
        valid = !!filter.filteredKeys?.[get(row, rowKey) as any]

        return
      }

      let rowValue: any = get(row, filter.field)

      if (filter.filterFormat) {
        rowValue = filter.filterFormat(row)
      } else if (filter.format) {
        rowValue = filter.format(row, rowValue)
      }

      if (Array.isArray(filter.value)) {
        const isAndCondition = filter.comparator === ComparatorEnum.IN_EVERY
          || filter.comparator === ComparatorEnum.IN_NONE
        let validInArray = false

        if (!isAndCondition) {
          filter.value.forEach(comparatorValue => {
            const isFilterValid = handleFilterData({
              comparator: filter.comparator,
              rowValue,
              value: comparatorValue,
              dataType: filter.dataType,
              textFnc,
            })

            if (!isFilterValid) {
              onInvalid?.(filter, row)
            }

            validInArray = validInArray || isFilterValid
          })
        } else {
          const isFilterValid = handleFilterData({
            comparator: filter.comparator,
            rowValue,
            value: filter.value,
            dataType: filter.dataType,
            textFnc,
          })

          if (!isFilterValid) {
            onInvalid?.(filter, row)
          }

          validInArray = validInArray || isFilterValid
        }

        valid = valid && validInArray
      } else {
        const isFilterValid = handleFilterData({
          comparator: filter.comparator,
          rowValue,
          value: filter.value,
          dataType: filter.dataType,
          textFnc,
        })

        if (!isFilterValid) {
          onInvalid?.(filter, row)
        }

        valid = valid && isFilterValid
      }
    })

    return valid
  })
}
