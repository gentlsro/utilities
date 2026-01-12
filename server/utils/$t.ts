import type { NamedValue, TranslateOptions } from '#i18n'

/**
 * i18n.t
 */
export function $t(key: string, pluralOrNamed?: NamedValue, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number | NamedValue, options?: TranslateOptions): string {
  // NOTE: This is a dummy function that just returns the key for server usage
  return `$t(${key}, ${pluralOrNamed}, ${options})`
}
