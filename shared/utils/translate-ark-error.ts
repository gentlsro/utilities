import type { ArkError } from 'arktype'

// Extended error type to access runtime properties that arktype provides
type ArkErrorExtended = ArkError & {
  rule?: unknown
  actual?: string
  expected?: string
  description?: string
  problem?: string
}

/**
 * Utility to create a custom arktype error
 * Usage in .narrow():
 *   ctx.reject(arkError({ message: $t('ark.errors.passwordMatch'), path: ['passwordAgain'] }))
 */
type ArkCustomError = {
  expected?: string
  message?: string
  relativePath?: PropertyKey[]
  actual?: string
  problem?: string
}

export function arkError(options: {
  message: string
  path?: PropertyKey[]
  actual?: string
}): ArkCustomError {
  return {
    message: options.message,
    expected: options.message, // Also set expected for consistency
    ...(options.path && { relativePath: options.path }),
    ...(options.actual && { actual: options.actual }),
  }
}

/**
 * Translates an ArkType error to a localized message
 * Similar to how zod-translation.ts works for Zod
 */
export function translateArkError(
  error: ArkError,
  $t: (key: string, params?: Record<string, unknown>) => string,
): string {
  const err = error as ArkErrorExtended
  const code = err.code as string

  // Special handling for email - detect by expected/description containing "email"
  // This catches email validation regardless of the specific error code
  const expectedStr = String(err.expected ?? '').toLowerCase()
  const descriptionStr = String(err.description ?? '').toLowerCase()

  if (expectedStr.includes('email') || descriptionStr.includes('email')) {
    return $t('ark.errors.email')
  }

  switch (code) {
    // Length constraints
    case 'minLength':
      return $t('ark.errors.minLength', {
        min: err.rule,
        actual: err.actual,
      })

    case 'maxLength':
      return $t('ark.errors.maxLength', {
        max: err.rule,
        actual: err.actual,
      })

    // Value constraints
    case 'min':
      return $t('ark.errors.min', {
        min: err.rule,
        actual: err.actual,
      })

    case 'max':
      return $t('ark.errors.max', {
        max: err.rule,
        actual: err.actual,
      })

    // Type errors
    case 'domain': {
      // Normalize "a number" → "number", "an array" → "array"
      const rawExpected = String(err.expected ?? '').replace(/^an?\s+/i, '')
      const typeKey = `ark.types.${rawExpected}`
      const translatedType = $t(typeKey)
      const was = error.actual

      if (was === 'undefined' || was === 'null') {
        return $t('ark.errors.required')
      }

      return $t('ark.errors.type', {
        expected: translatedType !== typeKey ? translatedType : rawExpected,
      })
    }

    // Required/missing
    case 'required':
    case 'missing':
      return $t('ark.errors.required')

    // Format validations
    case 'email':
    case 'string.email':
      return $t('ark.errors.email')

    case 'url':
    case 'string.url':
      return $t('ark.errors.url')

    case 'uuid':
    case 'string.uuid':
      return $t('ark.errors.uuid')

    case 'regex':
    case 'pattern':
      return $t('ark.errors.pattern', {
        pattern: err.rule,
      })

    case 'date':
    case 'string.date':
    case 'string.date.iso':
      return $t('ark.errors.date')

    // Union errors
    case 'union':
      return $t('ark.errors.union')

    // Array constraints
    case 'atLeastLength':
    case 'array.atLeastLength':
      return $t('ark.errors.array.atLeastLength', {
        min: err.rule,
        actual: err.actual,
      })

    case 'atMostLength':
    case 'array.atMostLength':
      return $t('ark.errors.array.atMostLength', {
        max: err.rule,
        actual: err.actual,
      })

    case 'exactlyLength':
    case 'array.exactlyLength':
      return $t('ark.errors.array.exactlyLength', {
        length: err.rule,
        actual: err.actual,
      })

    // Number constraints
    case 'divisibleBy':
      return $t('ark.errors.divisibleBy', {
        divisor: err.rule,
      })

    case 'integer':
      return $t('ark.errors.integer')

    case 'positive':
      return $t('ark.errors.positive')

    case 'negative':
      return $t('ark.errors.negative')

    // Object constraints
    case 'extraneousKey':
    case 'unrecognized':
      return $t('ark.errors.unrecognizedKey', {
        key: err.data,
      })

    // Handle predicate errors (custom narrow validations)
    // When using arkError({ message: $t('...') }), the message is already translated
    // and stored in `expected`, so we return it directly
    case 'predicate': {
      if (err.expected) {
        return err.expected
      }
      return $t('ark.errors.invalid')
    }

    default: {
      // Convention: try to use 'expected' as an i18n key for unknown codes too
      if (err.expected) {
        const customKey = `ark.errors.${err.expected}`
        const translated = $t(customKey)
        if (translated !== customKey) {
          return translated
        }
      }
      // Fallback: try to use the arktype's problem description
      if (err.problem) {
        return err.problem
      }
      if (err.description) {
        return $t('ark.errors.constraint', {
          constraint: err.description,
        })
      }

      return $t('ark.errors.invalid')
    }
  }
}
