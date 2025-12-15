// Types
import type { ZodInferred } from './zod-inferred.type'
import type { ZodSchemaObject } from './zod-schema-object.type'

export type ZodDataObject<T extends ZodSchemaObject> = {
  [P in keyof T]: ZodInferred<T[P]>
}
