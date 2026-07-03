import type { NamedValue, TranslateOptions } from '#i18n'

/**
 * i18n.t
 */
export function $t(key: string, pluralOrNamed?: NamedValue, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number | NamedValue, options?: TranslateOptions): string {
  const { $i18n } = useNuxtApp()
  const { t, locale } = $i18n

  const _options = options ?? { locale: locale.value }

  return pluralOrNamed
    ? t(key, pluralOrNamed as string, _options)
    : t(key, pluralOrNamed as string, _options)
}
