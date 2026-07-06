// Types
import type { IUtilitiesConfig } from './types/utilities-config.type'

// Functions
import { extendUtilitiesConfig } from './utils/extend-utilities-config'

// Constants
import { defaultUtilitiesConfig } from './constants/default-config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DataType
  // String
  = | 'string'

  // Number
    | 'number'
    | 'percent'
    | 'decimal'

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

const defaultConfig = {
  ...defaultUtilitiesConfig,
  files: {
    uploadHandler: async ({ file, requestHandler, onComplete, onError }) => {
      try {
        const result = await requestHandler?.(() => uploadFile({ file })) ?? uploadFile({ file })

        file.uploadProgress = 100
        file.hasError = false
        file.uploadedFile = result

        for await (const onUploadComplete of file.onUploadCompleteQueue ?? []) {
          await onUploadComplete(result)
        }

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

export default extendUtilitiesConfig(defaultConfig)
