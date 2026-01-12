import { describe, expect, it } from 'vitest'
import { stringToFloat } from '../../../shared/regex/string-to-float.regex'

describe('stringToFloat', () => {
  describe('valid number strings', () => {
    it('should extract positive integer', () => {
      expect(stringToFloat('123')).toBe('123')
    })

    it('should extract negative integer', () => {
      expect(stringToFloat('-123')).toBe('-123')
    })

    it('should extract positive float', () => {
      expect(stringToFloat('123.45')).toBe('123.45')
    })

    it('should extract negative float', () => {
      expect(stringToFloat('-123.45')).toBe('-123.45')
    })

    it('should extract float with leading zero', () => {
      expect(stringToFloat('0.45')).toBe('0.45')
    })

    it('should extract number from string with text before', () => {
      expect(stringToFloat('price: 123.45')).toBe('123.45')
    })

    it('should extract first number from string with text after', () => {
      expect(stringToFloat('123.45 dollars')).toBe('123.45')
    })

    it('should extract number from string with text on both sides', () => {
      expect(stringToFloat('The price is 123.45 dollars')).toBe('123.45')
    })

    it('should extract number with plus sign', () => {
      expect(stringToFloat('+123.45')).toBe('+123.45')
    })
  })

  describe('edge cases', () => {
    it('should return undefined for empty string', () => {
      expect(stringToFloat('')).toBeUndefined()
    })

    it('should return undefined for string without numbers', () => {
      expect(stringToFloat('abc')).toBeUndefined()
    })

    it('should return undefined for string with only spaces', () => {
      expect(stringToFloat('   ')).toBeUndefined()
    })

    it('should extract first number when multiple numbers exist', () => {
      expect(stringToFloat('123 and 456')).toBe('123')
    })

    it('should handle string starting with decimal point', () => {
      expect(stringToFloat('.45')).toBe('.45')
    })
  })
})
