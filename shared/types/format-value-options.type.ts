import type { ComparatorEnum } from '../../.nuxt/generated/comparator-enum'
import type { ExtendedDataType } from '../../.nuxt/generated/data-type.type'
import type { PredictDataTypeOptions } from './predict-data-type-options.type'

export type IFormatValueOptions = {
  comparator?: ComparatorEnum
  dataType?: ExtendedDataType
  dateFormat?: string
  emptyValue?: any
  localeIso?: string
  predictDataType?: PredictDataTypeOptions

  format?: (
    row: any,
    value: any,
    options?: Pick<IFormatValueOptions, 'dataType' | 'emptyValue' | 'comparator'>
  ) => any
}
