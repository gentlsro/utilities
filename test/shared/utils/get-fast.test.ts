import { describe, expect, it } from 'vitest'
import { getFast } from '../../../shared/utils/get-fast'

describe('getFast', () => {
  describe('string paths', () => {
    it('should get nested property using dot notation', () => {
      const obj = { user: { name: 'John' } }
      expect(getFast(obj, 'user.name')).toBe('John')
    })

    it('should get deeply nested property', () => {
      const obj = { a: { b: { c: { d: 'value' } } } }
      expect(getFast(obj, 'a.b.c.d')).toBe('value')
    })

    it('should return undefined for non-existent path', () => {
      const obj = { user: { name: 'John' } }
      expect(getFast(obj, 'user.age')).toBeUndefined()
    })

    it('should return default value for non-existent path', () => {
      const obj = { user: { name: 'John' } }
      expect(getFast(obj, 'user.age', 'N/A')).toBe('N/A')
    })

    it('should return default value when path is null', () => {
      const obj = { user: { name: 'John', address: null } }
      expect(getFast(obj, 'user.address.street', 'No address')).toBe('No address')
    })
  })

  describe('array paths', () => {
    it('should get nested property using array path', () => {
      const obj = { user: { name: 'John' } }
      expect(getFast(obj, ['user', 'name'])).toBe('John')
    })

    it('should get deeply nested property using array path', () => {
      const obj = { a: { b: { c: 'value' } } }
      expect(getFast(obj, ['a', 'b', 'c'])).toBe('value')
    })
  })

  describe('number paths', () => {
    it('should get property using number path', () => {
      const obj = { 0: 'zero', 1: 'one' }
      expect(getFast(obj, 0)).toBe('zero')
    })
  })

  describe('edge cases', () => {
    it('should return default value for null object', () => {
      expect(getFast(null, 'user.name', 'default')).toBe('default')
    })

    it('should return default value for undefined object', () => {
      expect(getFast(undefined, 'user.name', 'default')).toBe('default')
    })

    it('should return default value for non-object', () => {
      expect(getFast('not an object' as any, 'user.name', 'default')).toBe('default')
    })

    it('should return default value for array (not plain object)', () => {
      expect(getFast([1, 2, 3] as any, '0', 'default')).toBe('default')
    })

    it('should handle intermediate null values', () => {
      const obj = { user: null }
      expect(getFast(obj, 'user.name', 'default')).toBe('default')
    })

    it('should handle intermediate undefined values', () => {
      const obj = { user: undefined }
      expect(getFast(obj, 'user.name', 'default')).toBe('default')
    })

    it('should return value when it exists but is undefined', () => {
      const obj = { user: { name: undefined } }
      expect(getFast(obj, 'user.name')).toBeUndefined()
    })

    it('should return default when value is explicitly undefined', () => {
      const obj = { user: { name: undefined } }
      expect(getFast(obj, 'user.name', 'default')).toBe('default')
    })
  })

  describe('real-world scenarios', () => {
    it('should get user email from complex object', () => {
      const obj = {
        user: {
          profile: {
            contact: {
              email: 'john@example.com',
            },
          },
        },
      }
      expect(getFast(obj, 'user.profile.contact.email')).toBe('john@example.com')
    })

    it('should handle missing nested properties gracefully', () => {
      const obj = {
        user: {
          profile: {},
        },
      }
      expect(getFast(obj, 'user.profile.contact.email', 'No email')).toBe('No email')
    })
  })
})
