// Types
import type { ExtendedDataType } from '$dataType'

import type { ComparatorEnum as MergedComparatorEnum } from '$comparatorEnum'

type IComponent = {
  component: Component
  props?: IItem
  icon?: string
}

// NOTE: Do not remove, it's used in the generated file

enum ComparatorEnum {
  // Shared
  EQUAL = 'eq',
  NOT_EQUAL = 'not.eq',
  IN = 'in',
  NOT_IN = 'not.in',

  // String
  LIKE = 'like',
  CONTAINS = 'cs',
  STARTS_WITH = 'stw',
  ENDS_WITH = 'enw',
  NOT_LIKE = 'not.like',
  NOT_CONTAINS = 'not.cs',
  NOT_STARTS_WITH = 'not.stw',
  NOT_ENDS_WITH = 'not.enw',

  // Number
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN_OR_EQUAL = 'lte',

  // Boolean
  IS = 'is',
  NOT_IS = 'is.not',

  // Array
  IN_EVERY = 'in.every',
  IN_NONE = 'in.none',

  // Empty
  IS_EMPTY = 'is.$empty',
  NOT_IS_EMPTY = 'is.not.$empty',
}

type DataType =
  // String
  | 'string'

  // Number
  | 'number'
  | 'percent'

  // Currency
  | 'currency'

  // Duration
  | 'duration'

  // Date
  | 'date'
  | 'datetime'
  | 'yearMonth'
  | 'timestamp'
  | 'fullDateTime'

  // Boolean
  | 'boolean'
  | 'bool'

  // Custom
  | 'time'
  | 'custom'

export type IUtilitiesConfig = {
  general: {
    transliterate: boolean
  }

  /**
   * We can extend the data types for the application with our own, and map
   * them to the components we want to use for them
   */
  dataTypeExtend: {
    comparatorsByDataType?: Partial<Record<ExtendedDataType, MergedComparatorEnum[]>>
    defaultComparatorByDataType?: Partial<Record<ExtendedDataType, ComparatorEnum>>
    inputByDataType?: Partial<Record<ExtendedDataType, IComponent | undefined>>

    // We can also extend some of the predefined categories of data types
    selectorComparators?: MergedComparatorEnum[]
    nonValueComparators?: MergedComparatorEnum[]
    booleanishComparators?: MergedComparatorEnum[]
  }

  /**
   * Logging
   */
  logging: {
    limit: number
  }

  // Request handling
  request: {
    /**
     * Key to get the payload from the response
     */
    payloadKey: string

    /**
     * Function to modify the response data
     */
    modifyFnc: undefined | ((res: any) => any)

    /**
     *
     */
    errorHandler: ((error: any, t: any) => string[]) | undefined
  }
}

export const defaultUtilitiesConfig = {
  general: {
    transliterate: false,
  } as const,

  // Data types
  /**
   * We can extend the data types for the application with our own, and map
   * them to the components we want to use for them
   */
  dataTypeExtend: {
    comparatorsByDataType: {} as Partial<Record<ExtendedDataType, MergedComparatorEnum[]>>,
    inputByDataType: {} as Partial<Record<ExtendedDataType, IComponent | undefined>>,
    defaultComparatorByDataType: {} as Partial<Record<ExtendedDataType, ComparatorEnum>>,
    selectorComparators: [] as MergedComparatorEnum[],
    nonValueComparators: [] as MergedComparatorEnum[],
    booleanishComparators: [] as MergedComparatorEnum[],
  },

  // Logging
  logging: {
    limit: 100,
  },

  // Request handling
  request: {
    /**
     * Key to get the payload from the response
     */
    payloadKey: 'data',

    /**
     * Function to modify the response data
     */
    modifyFnc: undefined,

    /**
     *
     */
    errorHandler: undefined,
  },
} satisfies IUtilitiesConfig

export function extendUtilitiesConfig<T extends Partial<IUtilitiesConfig> & IItem>(config: T): T {
  return config
}

export default extendUtilitiesConfig(defaultUtilitiesConfig)
