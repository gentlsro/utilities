import { datetimeFormats, messagesByLocale, pluralRules } from './shared/i18n'

type DatetimeFormat = Record<string, Intl.DateTimeFormatOptions>

const DATETIME_FORMAT_BY_LANG = Object.keys(messagesByLocale).reduce((agg, lang) => {
  agg[lang] = datetimeFormats

  return agg
}, {} as Record<string, DatetimeFormat>)

export default defineI18nConfig(() => ({
  fallbackLocale: 'en-US',
  pluralRules,
  datetimeFormats: DATETIME_FORMAT_BY_LANG,
  warnHtmlInMessage: false,
  missingWarn: false,
  warnHtmlMessage: false,
  fallbackWarn: false,
}))
