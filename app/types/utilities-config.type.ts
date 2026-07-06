import type { ExtendedDataType } from '$dataType'
import type { ComparatorEnum as MergedComparatorEnum } from '$comparatorEnum'

// Types
import type { FileModel } from '../models/file.model'
import type { UseFnPayload } from './use-fn-payload.type'

type IComponent = {
  component: string
  props?: IItem
  icon?: string
}

type IFormatFnc = (
  value: any,
  row?: any,
  formatOptions?: IFormatValueOptions & {
    formatFnc?: typeof formatValue
    defaultHandler: () => any
  },
) => any

type IParseFnc = (payload: {
  value: any
  dataType?: ExtendedDataType
  options?: {
    dateFormat?: string
    timezone?: string
    comparator?: MergedComparatorEnum
    predictDataType?: PredictDataTypeOptions
    additionalData?: any
  }
  defaultHandler?: () => any
}) => any

export type IUtilitiesConfig = {
  /**
   * We can extend the data types for the application with our own, and map
   * them to the components we want to use for them
   */
  dataTypeExtend: {
    comparatorsByDataType?: Partial<Record<ExtendedDataType, MergedComparatorEnum[]>>
    defaultComparatorByDataType?: Partial<Record<ExtendedDataType, MergedComparatorEnum>>
    inputByDataType?: Partial<Record<ExtendedDataType, IComponent | undefined>>
    formatFncByDataType?: Partial<Record<ExtendedDataType, IFormatFnc>>
    parseFncByDataType?: Partial<Record<ExtendedDataType, IParseFnc>>

    // We can also extend some of the predefined categories of data types
    selectorComparators?: MergedComparatorEnum[]
    nonValueComparators?: MergedComparatorEnum[]
    booleanishComparators?: MergedComparatorEnum[]

    // We can also define "categories" of data types
    // For example, if we use the `Comparator.IN` for the `number` data type, we
    // want to only allow numbers to be inputted
    numberDataTypes?: ExtendedDataType[]
    dateTimeDataTypes?: ExtendedDataType[]
  }

  /**
   * Logging
   */
  logging: {
    limit?: number
  }

  /**
   * Files handling
   */
  files: {
    /**
     * The function to handle the file upload
     *
     * NOTE: You should mutate the `FileModel` attributes when uploading the file:
     * - `uploadProgress`
     * - `hasError`
     * - `uploadedFile`
     */
    uploadHandler?: (payload: {
      file: FileModel
      requestHandler?: any
      additionalData?: IItem
      headers?: IItem
      onError?: (error: any) => void
      onComplete?: (res: any) => void
    }) => Promise<any> | any

    /**
     * The function to handle the file deletion
     */
    deleteHandler?: (payload: {
      file: FileModel
      requestHandler: any
      additionalData?: IItem
      onComplete?: (res: any) => void
      onError?: (error: any) => void
    }) => Promise<any> | any
  }

  // Request handling
  request: {
    payloadKey?: string
    modifyFnc?: (obj: any) => any
    onComplete?: (payload: { response: any, result: any }) => void
    onError?: (payload: { error: any, response: any }) => Promise<any> | any
  }

  // Fn handling
  fn: {
    modifyResultFn?: (obj: any) => any
    onComplete?: (payload: { response: any, result: any, fnPayload: Omit<UseFnPayload<any>, 'onComplete' | 'onError'> }) => void
    onError?: (payload: { error: any, response: any, fnPayload: Omit<UseFnPayload<any>, 'onComplete' | 'onError'> }) => Promise<any> | any
  }
}
