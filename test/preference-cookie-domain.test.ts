import { describe, expect, it } from 'vitest'

import { getPreferenceCookieDomain } from '../app/functions/preference-cookie-domain'

describe('preference cookie domain', () => {
  it('applies the configured domain on that host and under it', () => {
    expect(getPreferenceCookieDomain('lc.gentl.tech', '.gentl.tech')).toBe('.gentl.tech')
    expect(getPreferenceCookieDomain('happykido.gentl.tech', 'gentl.tech')).toBe('.gentl.tech')
    expect(getPreferenceCookieDomain('GENTL.tech', '.gentl.tech')).toBe('.gentl.tech')
  })

  it('stays host-only on custom domains, unrelated hosts and without configuration', () => {
    expect(getPreferenceCookieDomain('happykido.cz', '.gentl.tech')).toBeUndefined()
    expect(getPreferenceCookieDomain('notgentl.tech', '.gentl.tech')).toBeUndefined()
    expect(getPreferenceCookieDomain('localhost', '')).toBeUndefined()
    expect(getPreferenceCookieDomain(undefined, '.gentl.tech')).toBeUndefined()
  })
})
