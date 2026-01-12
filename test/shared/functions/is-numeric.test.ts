import { describe, expect, it } from 'vitest'
import { isNumeric } from '../../../shared/functions/is-numeric'

describe('isNumeric', () => {
  describe('string inputs', () => {
    it('should return true for valid integer string', () => {
      expect(isNumeric('123')).toBe(true)
    })

    it('should return true for valid negative integer string', () => {
      expect(isNumeric('-123')).toBe(true)
    })

    it('should return true for valid float string', () => {
      expect(isNumeric('123.45')).toBe(true)
    })

    it('should return true for valid negative float string', () => {
      expect(isNumeric('-123.45')).toBe(true)
    })

    it('should return true for string with spaces that trim to valid number', () => {
      expect(isNumeric('  123  ')).toBe(true)
    })

    it('should return true for scientific notation string', () => {
      expect(isNumeric('1e5')).toBe(true)
    })

    it('should return false for empty string', () => {
      expect(isNumeric('')).toBe(false)
    })

    it('should return false for string with only spaces', () => {
      expect(isNumeric('   ')).toBe(false)
    })

    it('should return false for non-numeric string', () => {
      expect(isNumeric('abc')).toBe(false)
    })

    it('should return false for string with letters', () => {
      expect(isNumeric('123abc')).toBe(false)
    })

    it('should return false for string with special characters', () => {
      expect(isNumeric('123$')).toBe(false)
    })
  })

  describe('number inputs', () => {
    it('should return true for positive integer', () => {
      expect(isNumeric(123)).toBe(true)
    })

    it('should return true for negative integer', () => {
      expect(isNumeric(-123)).toBe(true)
    })

    it('should return true for positive float', () => {
      expect(isNumeric(123.45)).toBe(true)
    })

    it('should return true for negative float', () => {
      expect(isNumeric(-123.45)).toBe(true)
    })

    it('should return true for zero', () => {
      expect(isNumeric(0)).toBe(true)
    })

    it('should return true for negative zero', () => {
      expect(isNumeric(-0)).toBe(true)
    })

    it('should return false for Infinity (not finite)', () => {
      expect(isNumeric(Infinity)).toBe(false)
    })

    it('should return false for NaN', () => {
      expect(isNumeric(Number.NaN)).toBe(false)
    })
  })

  describe('other types', () => {
    it('should return false for null', () => {
      expect(isNumeric(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isNumeric(undefined)).toBe(false)
    })

    it('should return false for boolean true', () => {
      expect(isNumeric(true)).toBe(false)
    })

    it('should return false for boolean false', () => {
      expect(isNumeric(false)).toBe(false)
    })

    it('should return false for object', () => {
      expect(isNumeric({})).toBe(false)
    })

    it('should return false for array', () => {
      expect(isNumeric([])).toBe(false)
    })
  })
})
