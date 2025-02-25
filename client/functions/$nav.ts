import type { Locale } from '#i18n'
import type { RouteLocationRaw } from 'vue-router'

// Types
import type { NavigateToOptions } from '../types/navigate-to.type'

/**
 * Navigate to localized path
 */
export function $nav(
  route: RouteLocationRaw,
  locale?: Locale | undefined,
  options?: NavigateToOptions,
) {
  const localePath = useLocalePath()

  navigateTo(localePath(route, locale), options)
}
