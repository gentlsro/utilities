import { z } from 'zod'

// Constants
import { zodI18nMap } from '../../shared/constants/zod-translations'

export default defineNuxtPlugin(() => {
  // Translations for Zod
  z.setErrorMap(zodI18nMap)
})
