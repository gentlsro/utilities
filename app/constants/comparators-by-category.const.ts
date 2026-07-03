import { uniq } from 'lodash-es'
import { ComparatorEnum } from '$comparatorEnum'

const NON_VALUE_COMPARATORS = [
  ComparatorEnum.IS_EMPTY,
  ComparatorEnum.NOT_IS_EMPTY,
]

const BOOLEANISH_COMPARATORS = [
  ComparatorEnum.IS,
  ComparatorEnum.NOT_IS,
]

const SELECTOR_COMPARATORS = [
  ComparatorEnum.IN,
  ComparatorEnum.NOT_IN,
]

export function getNonValueComparators(extraComparators: ComparatorEnum[] = []) {
  return uniq([...NON_VALUE_COMPARATORS, ...extraComparators])
}

export function getBooleanishComparators(extraComparators: ComparatorEnum[] = []) {
  return uniq([...BOOLEANISH_COMPARATORS, ...extraComparators])
}

export function getSelectorComparators(extraComparators: ComparatorEnum[] = []) {
  return uniq([...SELECTOR_COMPARATORS, ...extraComparators])
}
