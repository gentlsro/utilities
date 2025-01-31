import utilsConfig from '$utilsConfig'
import { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

export function getDefaultComparatorByDataType(dataType?: ExtendedDataType) {
  if (!dataType) {
    return ComparatorEnum.EQUAL
  }

  let defaultComparator = utilsConfig.dataTypeExtend.defaultComparatorByDataType?.[dataType]
  const comparators = utilsConfig.dataTypeExtend.comparatorsByDataType?.[dataType]

  if (!defaultComparator) {
    const dt = dataType?.replace('Simple', '') as ExtendedDataType

    defaultComparator = utilsConfig.dataTypeExtend.defaultComparatorByDataType?.[dt]
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
