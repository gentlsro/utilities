export default defineNuxtPlugin(() => {
  const { $i18n } = tryUseNuxtApp() ?? {}
  const $t = $i18n?.t ?? ((...args: any[]) => args[0])

  // Translations for Zod
  z.config({
    customError: issue => {
      if (issue.message) {
        return { message: issue.message }
      }

      let message = issue.code ?? 'unknown issue'

      switch (issue.code) {
        case 'invalid_type':
          if (issue.input === undefined) {
            message = $t('zod.errors.invalid_type_received_undefined')
          } else {
            message = $t('zod.errors.invalid_type', {
              expected: $t(`zod.types.${issue.expected}`),
              received: $t(`zod.types.${issue.received}`),
            })
          }

          break

        case 'unrecognized_keys':
          message = $t('zod.errors.unrecognized_keys', {
            keys: issue.keys.join(', '),
            count: issue.keys.length,
          })

          break

        case 'invalid_union':
          message = $t('zod.errors.invalid_union')

          break

        case 'invalid_value':
          message = $t('zod.errors.invalid_value', {
            expected: issue.values.join(', '),
            received: issue.input,
          })

          break

        case 'too_small':
          message = $t(
            ['zod.errors.too_small', issue.origin, issue.inclusive === false ? 'not_inclusive' : 'inclusive'].join('.'),
            { minimum: String(issue.minimum) },
          )

          break

        case 'too_big':
          message = $t(
            ['zod.errors.too_big', issue.origin, issue.inclusive === false ? 'not_inclusive' : 'inclusive'].join('.'),
            { maximum: String(issue.maximum) },
          )

          break

        case 'invalid_format':
          message = $t(`zod.invalid_format.${issue.format}`, {
            prefix: issue.prefix,
            suffix: issue.suffix,
            regex: issue.pattern,
          })

          break

        case 'custom':
          message = $t('zod.errors.custom', {
            value: JSON.stringify(issue.params?.i18n ?? {}, null, 2),
          })

          break

        case 'not_multiple_of':
          message = $t('zod.errors.not_multiple_of', {
            multipleOf: issue.divisor,
          })

          break

        default:
          break
      }

      return { message }
    },
  })
})
