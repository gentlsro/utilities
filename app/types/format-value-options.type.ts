import type { ComparatorEnum } from '$comparatorEnum'
import type { ExtendedDataType } from '$dataType'

// Types
import type { formatValue } from '../utils/format-value'
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
  formatFncByDataType?: Partial<Record<ExtendedDataType, (
    value: any,
    row?: any,
    formatOptions?: IFormatValueOptions & {
      formatFnc?: typeof formatValue
      defaultHandler: () => any
    }
  ) => any>>
  localeIso?: string
  predictDataType?: PredictDataTypeOptions
  useUtc?: boolean

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
