import { describe, expect, it } from 'vitest'
import { cleanValue } from '../../../shared/utils/clean-value'

describe('cleanValue', () => {
  describe('null and undefined handling', () => {
    it('should return null for null', () => {
      expect(cleanValue(null)).toBeNull()
    })

    it('should return null for undefined', () => {
      expect(cleanValue(undefined)).toBeNull()
    })
  })

  describe('string handling', () => {
    it('should return trimmed string', () => {
      expect(cleanValue('  hello  ')).toBe('hello')
    })

    it('should return string without trimming if no spaces', () => {
      expect(cleanValue('hello')).toBe('hello')
    })

    it('should return null for empty string', () => {
      expect(cleanValue('')).toBeNull()
    })

    it('should return null for string with only spaces', () => {
      expect(cleanValue('   ')).toBeNull()
    })

    it('should return trimmed string with internal spaces preserved', () => {
      expect(cleanValue('  hello world  ')).toBe('hello world')
    })
  })

  describe('number handling', () => {
    it('should convert number to string', () => {
      expect(cleanValue(123)).toBe('123')
    })

    it('should convert zero to string', () => {
      expect(cleanValue(0)).toBe('0')
    })

    it('should convert negative number to string', () => {
      expect(cleanValue(-123)).toBe('-123')
    })

    it('should convert float to string', () => {
      expect(cleanValue(123.45)).toBe('123.45')
    })
  })

  describe('boolean handling', () => {
    it('should convert true to string', () => {
      expect(cleanValue(true)).toBe('true')
    })

    it('should convert false to string', () => {
      expect(cleanValue(false)).toBe('false')
    })
  })

  describe('object handling', () => {
    it('should convert object to string representation', () => {
      expect(cleanValue({})).toBe('[object Object]')
    })

    it('should convert array to string representation', () => {
      expect(cleanValue([1, 2, 3])).toBe('1,2,3')
    })
  })

  describe('edge cases', () => {
    it('should handle NaN', () => {
      expect(cleanValue(Number.NaN)).toBe('NaN')
    })

    it('should handle Infinity', () => {
      expect(cleanValue(Infinity)).toBe('Infinity')
    })

    it('should handle -Infinity', () => {
      expect(cleanValue(-Infinity)).toBe('-Infinity')
    })
  })
})
