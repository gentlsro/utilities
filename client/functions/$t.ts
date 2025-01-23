import type { NamedValue, TranslateOptions } from '#i18n'

/**
 * i18n.t
 */
export function $t(key: string, pluralOrNamed?: NamedValue, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number | NamedValue, options?: TranslateOptions): string {
  const { $i18n } = tryUseNuxtApp() ?? {}
  const t = $i18n?.t ?? ((...args: any) => args[0])
  const locale = toValue($i18n?.locale) ?? 'en-US'

  const _options = options ?? { locale }

  return pluralOrNamed
    ? t(key, pluralOrNamed as string, _options)
    : t(key, pluralOrNamed as string, _options)
}
