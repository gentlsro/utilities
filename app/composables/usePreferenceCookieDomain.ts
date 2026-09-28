import { getPreferenceCookieDomain } from '../functions/preference-cookie-domain'

/** Domain attribute for a preference cookie on the current host, if the configured domain covers it. */
export function usePreferenceCookieDomain() {
  return getPreferenceCookieDomain(useRequestURL().hostname, useRuntimeConfig().public.domain)
}
