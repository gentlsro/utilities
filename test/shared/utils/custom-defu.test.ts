import { describe, expect, it } from 'vitest'
import { customDefu } from '../../../shared/utils/custom-defu'

describe('customDefu', () => {
  describe('array handling', () => {
    it('should replace arrays instead of merging them', () => {
      const obj = { items: [1, 2, 3] }
      const defaults = { items: [4, 5, 6] }
      const result = customDefu(obj, defaults)
      expect(result.items).toEqual([1, 2, 3])
    })

    it('should use default array when obj array is null', () => {
      const obj = { items: null }
      const defaults = { items: [4, 5, 6] }
      const result = customDefu(obj, defaults)
      expect(result.items).toEqual([4, 5, 6])
    })

    it('should use default array when obj array is undefined', () => {
      const obj = { items: undefined }
      const defaults = { items: [4, 5, 6] }
      const result = customDefu(obj, defaults)
      expect(result.items).toEqual([4, 5, 6])
    })
  })

  describe('object merging', () => {
    it('should merge nested objects', () => {
      const obj = { nested: { a: 1 } }
      const defaults = { nested: { b: 2 } }
      const result = customDefu(obj, defaults)
      expect(result.nested).toEqual({ a: 1, b: 2 })
    })

    it('should merge multiple levels', () => {
      const obj = { level1: { level2: { a: 1 } } }
      const defaults = { level1: { level2: { b: 2 } } }
      const result = customDefu(obj, defaults)
      expect(result.level1.level2).toEqual({ a: 1, b: 2 })
    })
  })

  describe('primitive values', () => {
    it('should use obj value over default for strings', () => {
      const obj = { name: 'custom' }
      const defaults = { name: 'default' }
      const result = customDefu(obj, defaults)
      expect(result.name).toBe('custom')
    })

    it('should use obj value over default for numbers', () => {
      const obj = { count: 10 }
      const defaults = { count: 5 }
      const result = customDefu(obj, defaults)
      expect(result.count).toBe(10)
    })

    it('should use default when obj value is undefined', () => {
      const obj = {}
      const defaults = { name: 'default' }
      const result = customDefu(obj, defaults)
      expect(result.name).toBe('default')
    })
  })

  describe('mixed scenarios', () => {
    it('should handle mixed arrays and objects', () => {
      const obj = {
        items: [1, 2],
        config: { setting: 'custom' },
      }
      const defaults = {
        items: [3, 4, 5],
        config: { defaultSetting: 'default' },
      }
      const result = customDefu(obj, defaults)
      expect(result.items).toEqual([1, 2])
      expect(result.config).toEqual({ setting: 'custom', defaultSetting: 'default' })
    })

    it('should handle multiple arrays', () => {
      const obj = {
        items1: [1],
        items2: [2],
      }
      const defaults = {
        items1: [10],
        items2: [20],
      }
      const result = customDefu(obj, defaults)
      expect(result.items1).toEqual([1])
      expect(result.items2).toEqual([2])
    })
  })
})
