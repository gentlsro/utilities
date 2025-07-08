import type { z } from 'zod/v4'

export type IZodValidationItem = {
  $id: string
  $errors: z.core.$ZodIssue[]
  $messages: string[]
  $path: string
  $required: boolean
}
