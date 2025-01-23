import type { NamedValue, TranslateOptions } from '#i18n'

/**
 * i18n.t
 */
export function $t(key: string, pluralOrNamed?: NamedValue, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number | NamedValue, options?: TranslateOptions): string {
  return key
}
