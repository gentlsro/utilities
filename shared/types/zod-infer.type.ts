import type { z } from 'zod'

export type $infer<T extends z.ZodType<any, any>> = z.infer<T>
