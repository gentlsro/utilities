import { describe, expect, it } from 'vitest'
import { extractObjectKeys } from '../../../shared/utils/extract-object-keys'

describe('extractObjectKeys', () => {
  describe('simple objects', () => {
    it('should extract keys from flat object', () => {
      const obj = {
        str: 'foo',
        num: 123,
        bool: true,
      }
      const result = extractObjectKeys(obj)
      expect(result).toEqual(['str', 'num', 'bool'])
    })

    it('should extract keys from nested object', () => {
      const obj = {
        str: 'foo',
        nested: {
          key: 'value',
        },
      }
      const result = extractObjectKeys(obj)
      expect(result).toEqual(['str', 'nested.key'])
    })

    it('should extract keys from deeply nested object', () => {
      const obj = {
        level1: {
          level2: {
            level3: 'value',
          },
        },
      }
      const result = extractObjectKeys(obj)
      expect(result).toEqual(['level1.level2.level3'])
    })
  })

  describe('arrays', () => {
    it('should extract keys from array of objects', () => {
      const obj = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ]
      const result = extractObjectKeys(obj)
      expect(result).toEqual(['[n].name', '[n].age'])
    })

    it('should extract keys from nested arrays', () => {
      const obj = {
        items: [
          { name: 'John', roles: ['admin', 'user'] },
        ],
      }
      const result = extractObjectKeys(obj)
      expect(result).toEqual(['items.[n].name', 'items.[n].roles.[n]'])
    })

    it('should return empty array for empty array', () => {
      const obj: any[] = []
      const result = extractObjectKeys(obj)
      expect(result).toEqual([])
    })
  })

  describe('keepObjectKeys option', () => {
    it('should include object keys when keepObjectKeys is true', () => {
      const obj = {
        str: 'foo',
        nested: {
          key: 'value',
        },
      }
      const result = extractObjectKeys(obj, { keepObjectKeys: true })
      expect(result.toSorted()).toEqual(['nested', 'str', 'nested.key'].toSorted())
    })

    it('should not include object keys when keepObjectKeys is false', () => {
      const obj = {
        str: 'foo',
        nested: {
          key: 'value',
        },
      }
      const result = extractObjectKeys(obj, { keepObjectKeys: false })
      expect(result).toEqual(['str', 'nested.key'])
    })
  })

  describe('omitKeys option', () => {
    it('should omit specified keys', () => {
      const obj = {
        str: 'foo',
        num: 123,
        nested: {
          key: 'value',
        },
      }
      const result = extractObjectKeys(obj, { omitKeys: ['nested.key'] })
      expect(result).toEqual(['str', 'num'])
    })

    it('should omit multiple keys', () => {
      const obj = {
        str: 'foo',
        num: 123,
        bool: true,
      }
      const result = extractObjectKeys(obj, { omitKeys: ['str', 'num'] })
      expect(result).toEqual(['bool'])
    })

    it('should handle omitKeys with nested paths', () => {
      const obj = {
        level1: {
          level2: 'value',
        },
      }
      const result = extractObjectKeys(obj, { omitKeys: ['level1.level2'] })
      expect(result).toEqual([])
    })
  })

  describe('prefix option', () => {
    it('should add prefix to all keys', () => {
      const obj = {
        str: 'foo',
        num: 123,
      }
      const result = extractObjectKeys(obj, { prefix: 'data' })
      expect(result).toEqual(['data.str', 'data.num'])
    })

    it('should work with prefix and nested objects', () => {
      const obj = {
        nested: {
          key: 'value',
        },
      }
      const result = extractObjectKeys(obj, { prefix: 'data' })
      expect(result).toEqual(['data.nested.key'])
    })
  })

  describe('complex scenarios', () => {
    it('should handle the example from documentation', () => {
      const obj = {
        str: 'foo',
        num: 123,
        obj: { nestedKey: 'Test' },
        arr: [
          { name: 'John', roles: ['Something else'] },
          { name: 'Jane', roles: ['Member'] },
          { name: 'Thomas', roles: ['Admin'] },
        ],
      }
      const result = extractObjectKeys(obj)
      expect(result).toEqual([
        'str',
        'num',
        'obj.nestedKey',
        'arr.[n].name',
        'arr.[n].roles.[n]',
      ])
    })

    it('should handle mixed arrays and objects with options', () => {
      const obj = {
        items: [
          { name: 'John', meta: { age: 30 } },
        ],
      }
      const result = extractObjectKeys(obj, { keepObjectKeys: true })
      expect(result).toEqual([
        'items.[n]',
        'items.[n].name',
        'items.[n].meta',
        'items.[n].meta.age',
      ])
    })
  })

  describe('edge cases', () => {
    it('should return empty array for null', () => {
      const result = extractObjectKeys(null as any)
      expect(result).toEqual([])
    })

    it('should return empty array for undefined', () => {
      const result = extractObjectKeys(undefined as any)
      expect(result).toEqual([])
    })

    it('should return empty array for primitive values', () => {
      expect(extractObjectKeys('string' as any)).toEqual([])
      expect(extractObjectKeys(123 as any)).toEqual([])
      expect(extractObjectKeys(true as any)).toEqual([])
    })
  })
})
