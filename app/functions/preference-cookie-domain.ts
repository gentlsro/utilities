/**
 * The configured preference-cookie domain applies only when the current host
 * is that domain or lies under it. Anywhere else (a custom instance domain,
 * localhost) the cookie stays host-only; a browser would reject the foreign
 * `Domain` anyway. Preferences only: authentication cookies never use this.
 */
export function getPreferenceCookieDomain(hostname: string | undefined, configuredDomain: string | undefined) {
  const domain = (configuredDomain ?? '').trim().toLowerCase().replace(/^\./, '')
  const host = (hostname ?? '').trim().toLowerCase()

  if (!domain || !host) {
    return undefined
  }

  return host === domain || host.endsWith(`.${domain}`) ? `.${domain}` : undefined
}
