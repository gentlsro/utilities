import type { ComparatorEnum } from '$comparatorEnum'
import { BOOLEANISH_COMPARATORS } from '../constants/comparators-by-category.const'

export function isBooleanish(value: any) {
  if (typeof value === 'boolean') {
    return true
  } else if (typeof value === 'string') {
    const lowerCaseValue = value.toLowerCase().trim()

    return lowerCaseValue === 'true' || lowerCaseValue === 'false'
  }

  return false
}
