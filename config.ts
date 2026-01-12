import type { Locale } from '#i18n'

// Types
import type { ExtendedDataType } from '$dataType'

// Models
import type { FileModel } from './app/models/file.model'
import type { ComparatorEnum as MergedComparatorEnum } from '$comparatorEnum'

// Functions
import { uploadFile } from './app/utils/upload-file'
import { deleteFile } from './app/utils/delete-file'

const environment = (import.meta.env as any).NUXT_PUBLIC_ENV

type IComponent = {
  component: string
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

type DataType
  // String
  = | 'string'

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

type IFormatFnc = (
  value: any,
  row?: any,
  formatOptions?: IFormatValueOptions & { formatFnc?: typeof formatValue },
) => any

type IParseFnc = (
  value: any,
) => any

export type IUtilitiesConfig = {
  general: {
    locale?: Locale
    domain?: string
    transliterate?: boolean
    useUtc?: boolean
    environment?: string
  }

  /**
   * We can extend the data types for the application with our own, and map
   * them to the components we want to use for them
   */
  dataTypeExtend: {
    comparatorsByDataType?: Partial<Record<ExtendedDataType, MergedComparatorEnum[]>>
    defaultComparatorByDataType?: Partial<Record<ExtendedDataType, ComparatorEnum>>
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
}

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
    inputByDataType: {} as Partial<Record<ExtendedDataType, IComponent | undefined>>,
    defaultComparatorByDataType: {} as Partial<Record<ExtendedDataType, ComparatorEnum>>,
    selectorComparators: [] as MergedComparatorEnum[],
    nonValueComparators: [] as MergedComparatorEnum[],
    booleanishComparators: [] as MergedComparatorEnum[],
    formatFncByDataType: {} as Partial<Record<ExtendedDataType, IFormatFnc>>,
    parseFncByDataType: {} as Partial<Record<ExtendedDataType, IParseFnc>>,
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

  // Files handling
  files: {
    uploadHandler: async ({ file, requestHandler, onComplete, onError }) => {
      try {
        const result = await requestHandler?.(() => uploadFile({ file })) ?? uploadFile({ file })

        file.uploadProgress = 100
        file.hasError = false
        file.uploadedFile = result
        onComplete?.(result)

        return result
      } catch (error) {
        file.hasError = true
        file.uploadProgress = 0
        file.uploadedFile = undefined
        onError?.(error)

        return null
      }
    },
    deleteHandler: async ({ file, requestHandler, onComplete, onError }) => {
      try {
        const result = await requestHandler?.(() => deleteFile({ file })) ?? deleteFile({ file })
        onComplete?.(result)

        return result
      } catch (error) {
        onError?.(error)

        return null
      }
    },
  },
} satisfies IUtilitiesConfig

export function extendUtilitiesConfig<T extends Partial<IUtilitiesConfig> & IItem>(config: T): T {
  return config
}

export default extendUtilitiesConfig(defaultUtilitiesConfig)
