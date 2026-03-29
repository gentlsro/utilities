import type { NamedValue, TranslateOptions } from '#i18n'

/**
 * Server-side i18n marker. Produces a wire format that `$tFromServer` on the client parses and translates.
 * Format: `$t|key` or `$t|key|<json>` or `$t|key|<json>|<json>`
 */
export function $t(key: string, pluralOrNamed?: NamedValue, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number, options?: TranslateOptions): string
export function $t(key: string, pluralOrNamed?: string | number | NamedValue, options?: TranslateOptions): string {
  let result = `$t|${key}`

  if (pluralOrNamed !== undefined) {
    result += `|${JSON.stringify(pluralOrNamed)}`
  }

  if (options !== undefined) {
    if (pluralOrNamed === undefined) {
      result += '|'
    }

    result += `|${JSON.stringify(options)}`
  }

  return result
}
