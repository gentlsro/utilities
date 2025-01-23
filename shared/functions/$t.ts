import type { NamedValue, TranslateOptions } from '#i18n'

/**
 * i18n.t
 */
export function $t(key: string, pluralOrNamed?: NamedValue, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number | NamedValue, options?: TranslateOptions): string {
  const isServer = import.meta.server

  // NOTE: This is a dummy function that just returns the key for server usage
  if (isServer) {
    return key
  }

  const { t, locale } = useI18n()

  const _options = options ?? { locale: locale.value }

  return pluralOrNamed
    ? t(key, pluralOrNamed as string, _options)
    : t(key, pluralOrNamed as string, _options)
}
