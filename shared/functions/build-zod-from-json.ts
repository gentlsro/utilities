// @ts-nocheck
import type { DataType } from '$dataType'
import { ZOD_VALIDATORS } from '$utils'
import type { ZodAny, ZodArray, ZodBoolean, ZodCustom, ZodDate, ZodNumber, ZodObject, ZodString, ZodUnknown } from 'zod/v4'

export function buildZodFromJson(payload: {
  schema: IItem
  dataType: DataType
}) {
  const { schema, dataType } = payload

  let zodSchema: ZodNumber | ZodBoolean | ZodString | ZodObject | ZodArray | ZodDate | ZodAny | ZodUnknown | ZodCustom

  switch (dataType) {
    case 'number':
      zodSchema = z.number()
      break

    case 'boolean':
      zodSchema = z.boolean()
      break

    case 'string':
      zodSchema = z.string()
      break

    case 'date':
      zodSchema = z
        .custom<Datetime>()
        .refine(value => ZOD_VALIDATORS.validDate(value))

      break

    default:
      zodSchema = z.unknown()
      break
  }

  // Min length
  if (schema.minLength) {
    // @ts-expect-error
    zodSchema = zodSchema.min(schema.minLength)
  }

  // Max length
  if (schema.maxLength) {
    // @ts-expect-error
    zodSchema = zodSchema.max(schema.maxLength)
  }

  // Min
  if (schema.min) {
    // @ts-expect-error
    zodSchema = zodSchema.min(schema.min)
  }

  // Max
  if (schema.max) {
    // @ts-expect-error
    zodSchema = zodSchema.max(schema.max)
  }

  // Pattern
  if (schema.pattern) {
    // @ts-expect-error
    zodSchema = zodSchema.regex(schema.pattern)
  }

  // Enum
  if (schema.enum) {
    // @ts-expect-error
    zodSchema = zodSchema.enum(schema.enum)
  }

  // Array
  if (schema.array) {
    zodSchema = zodSchema.array()
  }

  // Not required
  if (!schema.required) {
    // @ts-expect-error
    zodSchema = zodSchema.nullish()
  }

  // Required and custom
  if (schema.required && dataType === 'custom') {
    zodSchema = zodSchema.refine((val: any) => !isNil(val), {
      message: $t('zod.errors.required'),
    })
  }

  return zodSchema
}
