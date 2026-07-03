import type { ExtendedDataType } from '$dataType'
import type { ComparatorEnum as MergedComparatorEnum } from '$comparatorEnum'

// Types
import type { IUtilitiesConfig } from '../types/utilities-config.type'

const environment = (import.meta as any).env.NUXT_PUBLIC_ENV

export const defaultUtilitiesConfig = {
  general: {
    locale: 'en-US',
    transliterate: false,
    domain: undefined,
    useUtc: false,
    environment,
  },

  // Data types
  /**
   * We can extend the data types for the application with our own, and map
   * them to the components we want to use for them
   */
  dataTypeExtend: {
    comparatorsByDataType: {} as Partial<Record<ExtendedDataType, MergedComparatorEnum[]>>,
    inputByDataType: {} as Partial<Record<ExtendedDataType, IUtilitiesConfig['dataTypeExtend']['inputByDataType'] extends Partial<Record<ExtendedDataType, infer T>> ? T : never>>,
    defaultComparatorByDataType: {} as Partial<Record<ExtendedDataType, MergedComparatorEnum>>,
    selectorComparators: [] as MergedComparatorEnum[],
    nonValueComparators: [] as MergedComparatorEnum[],
    booleanishComparators: [] as MergedComparatorEnum[],
    formatFncByDataType: {} as NonNullable<IUtilitiesConfig['dataTypeExtend']['formatFncByDataType']>,
    parseFncByDataType: {} as NonNullable<IUtilitiesConfig['dataTypeExtend']['parseFncByDataType']>,
    numberDataTypes: ['number', 'numberSimple'] as ExtendedDataType[],
    dateTimeDataTypes: ['date', 'datetime', 'yearMonth', 'timestamp', 'fullDateTime'] as ExtendedDataType[],
  },

  // Logging
  logging: {
    limit: 100,
  },

  // Request handling
  request: {
    payloadKey: undefined,
    modifyFnc: undefined,
    onComplete: undefined,
    onError: undefined,
  },

  // Fn handling
  fn: {
    modifyResultFn: undefined,
    onComplete: undefined,
    onError: undefined,
  },

  // Files handling
  files: {},
} satisfies IUtilitiesConfig