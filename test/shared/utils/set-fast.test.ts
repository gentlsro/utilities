import { describe, expect, it } from 'vitest'
import { setFast } from '../../../shared/utils/set-fast'

describe('setFast', () => {
  describe('string paths', () => {
    it('should set nested property using dot notation', () => {
      const obj: any = {}
      setFast(obj, 'user.name', 'John')
      expect(obj.user.name).toBe('John')
    })

    it('should set deeply nested property', () => {
      const obj: any = {}
      setFast(obj, 'a.b.c.d', 'value')
      expect(obj.a.b.c.d).toBe('value')
    })

    it('should create intermediate objects', () => {
      const obj: any = { user: {} }
      setFast(obj, 'user.profile.email', 'john@example.com')
      expect(obj.user.profile.email).toBe('john@example.com')
    })

    it('should overwrite existing values', () => {
      const obj: any = { user: { name: 'Old' } }
      setFast(obj, 'user.name', 'New')
      expect(obj.user.name).toBe('New')
    })
  })

  describe('array paths', () => {
    it('should set nested property using array path', () => {
      const obj: any = {}
      setFast(obj, ['user', 'name'], 'John')
      expect(obj.user.name).toBe('John')
    })

    it('should set deeply nested property using array path', () => {
      const obj: any = {}
      setFast(obj, ['a', 'b', 'c'], 'value')
      expect(obj.a.b.c).toBe('value')
    })
  })

  describe('mutation', () => {
    it('should mutate the original object', () => {
      const obj: any = {}
      const result = setFast(obj, 'user.name', 'John')
      expect(result).toBe(obj)
    })

    it('should preserve existing properties', () => {
      const obj: any = { existing: 'value' }
      setFast(obj, 'user.name', 'John')
      expect(obj.existing).toBe('value')
      expect(obj.user.name).toBe('John')
    })
  })

  describe('error handling', () => {
    it('should throw error for null object', () => {
      expect(() => {
        setFast(null as any, 'user.name', 'John')
      }).toThrow('Cannot set property on null, undefined, or non-object.')
    })

    it('should throw error for undefined object', () => {
      expect(() => {
        setFast(undefined as any, 'user.name', 'John')
      }).toThrow('Cannot set property on null, undefined, or non-object.')
    })

    it('should throw error for non-object', () => {
      expect(() => {
        setFast('not an object' as any, 'user.name', 'John')
      }).toThrow('Cannot set property on null, undefined, or non-object.')
    })

    it('should throw error for array (not plain object)', () => {
      expect(() => {
        setFast([1, 2, 3] as any, '0', 'value')
      }).toThrow('Cannot set property on null, undefined, or non-object.')
    })
  })

  describe('intermediate null/undefined handling', () => {
    it('should create new object when intermediate is null', () => {
      const obj: any = { user: null }
      setFast(obj, 'user.name', 'John')
      expect(obj.user.name).toBe('John')
    })

    it('should create new object when intermediate is undefined', () => {
      const obj: any = { user: undefined }
      setFast(obj, 'user.name', 'John')
      expect(obj.user.name).toBe('John')
    })

    it('should overwrite non-object intermediate values', () => {
      const obj: any = { user: 'string' }
      setFast(obj, 'user.name', 'John')
      expect(obj.user.name).toBe('John')
    })
  })

  describe('different value types', () => {
    it('should set string values', () => {
      const obj: any = {}
      setFast(obj, 'value', 'string')
      expect(obj.value).toBe('string')
    })

    it('should set number values', () => {
      const obj: any = {}
      setFast(obj, 'value', 123)
      expect(obj.value).toBe(123)
    })

    it('should set boolean values', () => {
      const obj: any = {}
      setFast(obj, 'value', true)
      expect(obj.value).toBe(true)
    })

    it('should set object values', () => {
      const obj: any = {}
      const nested = { nested: 'value' }
      setFast(obj, 'value', nested)
      expect(obj.value).toBe(nested)
    })

    it('should set array values', () => {
      const obj: any = {}
      setFast(obj, 'value', [1, 2, 3])
      expect(obj.value).toEqual([1, 2, 3])
    })

    it('should set null values', () => {
      const obj: any = {}
      setFast(obj, 'value', null)
      expect(obj.value).toBeNull()
    })
  })

  describe('real-world scenarios', () => {
    it('should set user email in complex object', () => {
      const obj: any = {}
      setFast(obj, 'user.profile.contact.email', 'john@example.com')
      expect(obj.user.profile.contact.email).toBe('john@example.com')
    })

    it('should handle multiple nested sets', () => {
      const obj: any = {}
      setFast(obj, 'user.name', 'John')
      setFast(obj, 'user.age', 30)
      setFast(obj, 'user.email', 'john@example.com')
      expect(obj.user).toEqual({
        name: 'John',
        age: 30,
        email: 'john@example.com',
      })
    })
  })
})
