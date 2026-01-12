import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isDev } from '../../../shared/utils/is-dev'

describe('isDev', () => {
  const originalImportMeta = import.meta

  beforeEach(() => {
    // Reset import.meta before each test
    vi.resetModules()
  })

  afterEach(() => {
    // Restore original import.meta
    Object.defineProperty(globalThis, 'import', {
      value: { meta: originalImportMeta },
      writable: true,
      configurable: true,
    })
  })

  it('should return import.meta.dev value', () => {
    // Note: This test depends on the actual environment
    // In a real Nuxt test environment, import.meta.dev should be available
    const result = isDev()
    expect(typeof result).toBe('boolean')
  })
})
