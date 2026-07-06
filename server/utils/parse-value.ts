import { isNil } from 'lodash-es'
import type { ExtendedDataType } from '$dataType'

// Utils
import { $date } from '../../shared/utils/$date'

function handleParseValue(payload: {
  value: any
  dataType?: ExtendedDataType
  options?: {
    dateFormat?: string
    timezone?: string
    useUtc?: boolean
  }
}) {
  let { value, dataType, options } = payload
  const { dateFormat, timezone, useUtc } = options || {}

  dataType = dataType?.replace(/Simple$/, '') as ExtendedDataType

  switch (dataType) {
    case 'number':
    case 'percent':
      return Number(value)

    case 'date':
    case 'datetime':
    case 'timestamp':
    case 'yearMonth':
      return dateFormat
        ? timezone
          ? $date(value, { utc: useUtc }).tz(timezone).format(dateFormat)
          : $date(value, { utc: useUtc }).format(dateFormat)
        : $date(value, { utc: useUtc })

    case 'boolean':
      if (typeof value === 'boolean') {
        return value
      } else if (value === 'true') {
        return true
      } else if (value === 'false') {
        return false
      } else if (value === 'null') {
        return null
      }

      return

    case 'string':
    case 'time':
    default:
      return value
  }
}

export function parseValue(
  value: any,
  dataType?: ExtendedDataType,
  options?: {
    dateFormat?: string
    timezone?: string
    useUtc?: boolean
    additionalData?: any
  },
) {
  const rC = useRuntimeConfig()

  options ??= {}
  options.useUtc ??= rC.public.useUtc

  if (isNil(value)) {
    return value
  }

  return handleParseValue({ value, dataType, options })
}
