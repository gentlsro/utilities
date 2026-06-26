import { translateZodIssue } from '../functions/translate-zod-issue'

export default defineNuxtPlugin(() => {
  z.config({
    customError: translateZodIssue,
  })
})
