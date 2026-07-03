// Locales
import csCz from '../../i18n/cs-CZ_utilities.json'
import enUs from '../../i18n/en-US_utilities.json'

export const messagesByLocale = {
  'cs-CZ': csCz,
  'en-US': enUs,
} as const

export const availableLocales = Object.keys(messagesByLocale)

export const LOCALE_DEFAULT = 'cs-CZ' as const
export const CURRENCY_DEFAULT = 'CZK'
