import type { z } from 'zod'

export type IZodValidationItem = {
  $id: string
  $errors: z.core.$ZodIssue[]
  $messages: string[]
  $path: string
  $required: boolean
}
