import type { z } from 'zod/v4'

export type ZodInferred<T extends z.ZodType<any, any>> = MaybeRefOrGetter<z.infer<T>>
