import type { ExtendedDataType } from '$dataType'
import { ComparatorEnum } from '$comparatorEnum'

export function getComparatorsByDataType(dataType: ExtendedDataType) {
  switch (dataType) {
    case 'string':
    case 'stringSimple':
      return [
        ComparatorEnum.EQUAL,
        ComparatorEnum.NOT_EQUAL,
        ComparatorEnum.LIKE,
        ComparatorEnum.NOT_LIKE,
        ComparatorEnum.CONTAINS,
        ComparatorEnum.NOT_CONTAINS,
        ComparatorEnum.STARTS_WITH,
        ComparatorEnum.NOT_STARTS_WITH,
        ComparatorEnum.ENDS_WITH,
        ComparatorEnum.NOT_ENDS_WITH,
        ComparatorEnum.IS_EMPTY,
        ComparatorEnum.NOT_IS_EMPTY,
        ComparatorEnum.IN,
        ComparatorEnum.NOT_IN,
      ]

    case 'number':
    case 'numberSimple':
    case 'percent':
    case 'percentSimple':
    case 'duration':
    case 'durationSimple':
      return [
        ComparatorEnum.EQUAL,
        ComparatorEnum.NOT_EQUAL,
        ComparatorEnum.GREATER_THAN,
        ComparatorEnum.GREATER_THAN_OR_EQUAL,
        ComparatorEnum.LESS_THAN,
        ComparatorEnum.LESS_THAN_OR_EQUAL,
        ComparatorEnum.IS_EMPTY,
        ComparatorEnum.NOT_IS_EMPTY,
        ComparatorEnum.IN,
        ComparatorEnum.NOT_IN,
      ]

    case 'date':
    case 'dateSimple':
    case 'datetime':
    case 'datetimeSimple':
    case 'timestamp':
    case 'timestampSimple':
    case 'fullDateTime':
    case 'fullDateTimeSimple':
    case 'yearMonth':
    case 'yearMonthSimple':
      return [
        ComparatorEnum.EQUAL,
        ComparatorEnum.NOT_EQUAL,
        ComparatorEnum.GREATER_THAN,
        ComparatorEnum.GREATER_THAN_OR_EQUAL,
        ComparatorEnum.LESS_THAN,
        ComparatorEnum.LESS_THAN_OR_EQUAL,
        ComparatorEnum.IS_EMPTY,
        ComparatorEnum.NOT_IS_EMPTY,
      ]

    case 'boolean':
    case 'booleanSimple':
    case 'bool':
    case 'boolSimple':
      return [
        ComparatorEnum.IS,
        ComparatorEnum.NOT_IS,
      ]

    case 'time':
    case 'timeSimple':
      return [
        ComparatorEnum.EQUAL,
        ComparatorEnum.NOT_EQUAL,
        ComparatorEnum.GREATER_THAN,
        ComparatorEnum.GREATER_THAN_OR_EQUAL,
        ComparatorEnum.LESS_THAN,
        ComparatorEnum.LESS_THAN_OR_EQUAL,
      ]

    default:
      return []
  }
}
