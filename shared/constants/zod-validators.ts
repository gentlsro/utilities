function parseDate(dateRef: MaybeRefOrGetter<Datetime>) {
  return $date(toValue(dateRef))
}

export const ZOD_VALIDATORS = {
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
