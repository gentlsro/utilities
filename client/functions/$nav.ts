import type { RouteLocationRaw } from 'vue-router'

// Types
import type { NavigateToOptions } from '../types/navigate-to.type'

/**
 * Navigate to localized path
 */
export function $nav(
  route: RouteLocationRaw,
  locale?: string | undefined,
  options?: NavigateToOptions,
) {
  const localePath = useLocalePath()

  navigateTo(localePath(route, locale), options)
}
