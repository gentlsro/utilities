import { beforeEach, describe, expect, it } from 'vitest'
import { useSharedActiveElement } from '../../../app/composables/useSharedActiveElement'

describe('useSharedActiveElement', () => {
  beforeEach(() => {
    // Reset document.activeElement before each test
    if (document.activeElement && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  })

  it('should be defined and export a function', () => {
    expect(useSharedActiveElement).toBeDefined()
    expect(typeof useSharedActiveElement).toBe('function')
  })

  // Note: Full integration tests would require a Nuxt test environment
  // with proper VueUse setup. The composable wraps useActiveElement from VueUse
  // using createSharedComposable, which requires Nuxt context.
})
