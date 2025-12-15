import type { Locale } from '#i18n'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Returns localized path
 */
export function $p(route: RouteLocationRaw, locale?: Locale | undefined) {
  const localePath = useLocalePath()

  return localePath(route, locale || undefined)
}
