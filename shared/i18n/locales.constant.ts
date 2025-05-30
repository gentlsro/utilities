import type { Locale } from '#i18n'

// Locales
import csCz from '../../i18n/cs-CZ_utilities.json'
import enUs from '../../i18n/en-US_utilities.json'

export const messagesByLocale = {
  'cs-CZ': csCz,
  'en-US': enUs,
} as Partial<Record<Locale, any>>

export const availableLocales = Object.keys(messagesByLocale)

export const LOCALE_DEFAULT = 'cs-CZ'
export const CURRENCY_DEFAULT = 'CZK'
