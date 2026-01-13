import type { z } from 'zod'

export type ZodInferred<T extends z.ZodType<any, any>> = MaybeRefOrGetter<z.infer<T>>
