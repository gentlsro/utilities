import type { z } from 'zod/v4'

export type ZodSchemaObject = Record<string, z.ZodType<any, any>>
