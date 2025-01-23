import type { RouteLocationRaw } from 'vue-router'

/**
 * Returns localized path
 */
export function $p(route: RouteLocationRaw, locale?: string | undefined) {
  const localePath = useLocalePath()

  return localePath(route, locale || undefined)
}
