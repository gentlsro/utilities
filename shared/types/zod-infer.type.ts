import type { z } from 'zod/v4'

export type $infer<T extends z.ZodType<any, any>> = z.infer<T>
