import { ComparatorEnum } from '$comparatorEnum'
import { utilsConfig } from '$utilsConfig'

export const NON_VALUE_COMPARATORS = [
  ComparatorEnum.IS_EMPTY,
  ComparatorEnum.NOT_IS_EMPTY,
  ...utilsConfig.dataTypeExtend.nonValueComparators,
]

export const BOOLEANISH_COMPARATORS = [
  ComparatorEnum.IS,
  ComparatorEnum.NOT_IS,
  ...utilsConfig.dataTypeExtend.booleanishComparators,
]

export const SELECTOR_COMPARATORS = [
  ComparatorEnum.IN,
  ComparatorEnum.NOT_IN,
  ...utilsConfig.dataTypeExtend.selectorComparators,
]

export const NUMBER_COMPARATORS = [
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
