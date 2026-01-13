import type { z } from 'zod'

// Types
import type { IZodValidationItem } from './zod-validation-item.type'
import type { ZodSchemaObject } from './zod-schema-object.type'

export type IZodShape<T extends ZodSchemaObject> = {
  [P in keyof T]: ZodErrorShape<z.infer<T[P]>>
}

type ZodErrorShape<T> = T extends object
  ? {
      [P in keyof T]?: T[P] extends z.ZodType<any, any>
        ? IZodValidationItem
        : ZodErrorShape<T[P]> & IZodValidationItem
    }
  : IZodValidationItem
