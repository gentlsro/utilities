// This should be properly typed but the fucking i18n library is the worst fucking
// thing ever, so just leave `any`...

/**
 * Server-side i18n marker. Produces a wire format that `$tFromServer` on the client parses and translates.
 * Format: `$t|key` or `$t|key|<json>` or `$t|key|<json>|<json>`
 */
export function $t(key: string, pluralOrNamed?: any, options?: any): string
export function $t(key: string, pluralOrNamed?: string | number, options?: any): string
export function $t(key: string, pluralOrNamed?: string | number | any, options?: any): string {
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
