import type { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'
import type { PredictDataTypeOptions } from './predict-data-type-options.type'

type ISource = {
  type: 'component' | 'composable' | 'store'
  name: string
  id?: string
}

export type IFormatValueOptions = {
  comparator?: ComparatorEnum
  dataType?: ExtendedDataType
  dateFormat?: string
  emptyValue?: any
  localeIso?: string
  predictDataType?: PredictDataTypeOptions

  /**
   * The source from where the value is coming from
   */
  source?: ISource

  format?: (
    row: any,
    value: any,
    options?: Pick<IFormatValueOptions, 'dataType' | 'emptyValue' | 'comparator'>,
  ) => any
}
