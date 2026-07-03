import { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

export function getDefaultComparatorByDataType(
  dataType?: ExtendedDataType,
  options: {
    comparatorsByDataType?: Partial<Record<ExtendedDataType, ComparatorEnum[]>>
    defaultComparatorByDataType?: Partial<Record<ExtendedDataType, ComparatorEnum>>
  } = {},
) {
  if (!dataType) {
    return ComparatorEnum.EQUAL
  }

  const {
    comparatorsByDataType = {},
    defaultComparatorByDataType = {},
  } = options

  let defaultComparator = defaultComparatorByDataType?.[dataType]
  const _dataType = dataType as keyof typeof comparatorsByDataType
  const comparators = comparatorsByDataType?.[_dataType]

  if (!defaultComparator) {
    const dt = dataType?.replace('Simple', '') as ExtendedDataType

    defaultComparator = defaultComparatorByDataType?.[dt]
  }

  if (defaultComparator) {
    return defaultComparator
  }

  switch (dataType) {
    case 'string':
    case 'stringSimple':
      return ComparatorEnum.STARTS_WITH

    case 'bool':
    case 'boolSimple':
    case 'boolean':
    case 'booleanSimple':
      return ComparatorEnum.IS

    default:
      return comparators?.[0] ?? ComparatorEnum.EQUAL
  }
}
