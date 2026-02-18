import type { NamedValue } from '#i18n'

/**
 * i18n.t
 */
export function $t(key: string, pluralOrNamed?: NamedValue): string
export function $t(key: string, pluralOrNamed?: string | number): string
export function $t(key: string, pluralOrNamed?: string | number | NamedValue): string {
  if (!pluralOrNamed) {
    return key
  }

  // NOTE: This is a dummy function that just returns the key for server usage
  return `${key}, ${pluralOrNamed}`
}
