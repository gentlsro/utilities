import type { Locale } from '#i18n'
import { availableLocales, datetimeFormats } from './app/i18n'

type DatetimeFormat = Record<string, Intl.DateTimeFormatOptions>

const DATETIME_FORMAT_BY_LANG = availableLocales.reduce((agg, lang) => {
  agg[lang as Locale] = datetimeFormats

  return agg
}, {} as Record<Locale, DatetimeFormat>)

export default defineI18nConfig(() => ({
  fallbackLocale: 'en-US',
  // Not `pluralRules` (./app/i18n): the app's messages and `$t(key, count)` calls are written for vue-i18n's default
  // rules (count 0 picks the first form), so these would change text across the app
  datetimeFormats: DATETIME_FORMAT_BY_LANG,
  warnHtmlInMessage: false,
  missingWarn: false,
  warnHtmlMessage: false,
  fallbackWarn: false,
}))
