import { type } from 'arktype'
import { arkError } from '../utils/translate-ark-error'

function parseDate(date: Datetime) {
  return $date(date)
}

const ARK_VALIDATOR_FNS = {
  /**
   * Checks if the value is required
   */
  required: (value: unknown) => {
    return !isNil(value)
  },

  /**
   * Checks if the string value is numeric ~ contains only integers
   *
   * Note: will return true for empty string
   */
  numeric: (value: unknown) => {
    const numericRegex = /^\d+$/

    if (typeof value !== 'string') {
      return isNil(value)
    }

    if (value === '') {
      return true
    }

    return numericRegex.test(value ?? '')
  },

  /**
   * Checks validity of the provided `Datetime`
   */
  validDate: (
    value: Datetime,
    options?: {
      isRequired?: boolean | ((val: any) => boolean)
    },
  ) => {
    const { isRequired = true } = options ?? {}

    if (isRequired && !value) {
      return false
    }

    const parsedDate = parseDate(value)

    return parsedDate.isValid()
  },

  /**
   * Checks whether the object has `id` property with any value (not null or undefined)
   */
  hasId: (value: any, options?: { idKey?: string }) => {
    const { idKey = 'id' } = options ?? {}

    return !isNil(value?.[idKey])
  },
}

export const ARK_VALIDATORS = {
  required: type('unknown').narrow((value, ctx) => {
    if (!ARK_VALIDATOR_FNS.required(value)) {
      ctx.reject(arkError({ message: $t('ark.errors.required') }))
    }

    return true
  }),
  numeric: type('unknown').narrow((value, ctx) => {
    if (!ARK_VALIDATOR_FNS.numeric(value)) {
      ctx.reject(arkError({ message: $t('ark.errors.numeric') }))
    }

    return true
  }),
  validDate: type('unknown').narrow((value, ctx) => {
    if (!value) {
      ctx.reject(arkError({ message: $t('ark.errors.required') }))

      return true
    }

    if (!ARK_VALIDATOR_FNS.validDate(value as Datetime)) {
      ctx.reject(arkError({ message: $t('ark.errors.date') }))
    }

    return true
  }),
  hasId: type('unknown').narrow((value, ctx) => {
    if (!ARK_VALIDATOR_FNS.hasId(value)) {
      ctx.reject(arkError({ message: $t('ark.errors.missingId') }))
    }

    return true
  }),
}
