import { config } from 'zod/v4/core'

import { translateZodIssue } from '../functions/translate-zod-issue'

// Zod's core `config` (2 KB) sets the error map for every schema; the full `zod` entry would load the whole library on
// every page, published pages included
export default defineNuxtPlugin(() => {
  config({
    customError: translateZodIssue,
  })
})
