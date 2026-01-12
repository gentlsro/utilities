import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs/esm'
import { isValidDate } from '../../../shared/functions/is-valid-date'

describe('isValidDate', () => {
  describe('Date instances', () => {
    it('should return true for valid Date instance', () => {
      expect(isValidDate(new Date())).toBe(true)
    })

    it('should return true for Date instance with specific date', () => {
      expect(isValidDate(new Date('2024-01-01'))).toBe(true)
    })

    it('should return true for Date instance created from timestamp', () => {
      expect(isValidDate(new Date(1704067200000))).toBe(true)
    })
  })

  describe('dayjs instances', () => {
    it('should return true for dayjs instance', () => {
      expect(isValidDate(dayjs())).toBe(true)
    })

    it('should return true for dayjs instance with specific date', () => {
      expect(isValidDate(dayjs('2024-01-01'))).toBe(true)
    })
  })

  describe('string inputs', () => {
    it('should return true for valid ISO date string', () => {
      expect(isValidDate('2024-01-01')).toBe(true)
    })

    it('should return true for valid date string with time', () => {
      expect(isValidDate('2024-01-01T12:00:00Z')).toBe(true)
    })

    it('should return true for valid date string in common format', () => {
      expect(isValidDate('01/01/2024')).toBe(true)
    })

    it('should return false for invalid date string', () => {
      expect(isValidDate('not-a-date')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidDate('')).toBe(false)
    })

    it('should return false for string with only spaces', () => {
      expect(isValidDate('   ')).toBe(false)
    })
  })

  describe('number inputs', () => {
    it('should return true for valid timestamp', () => {
      expect(isValidDate(1704067200000)).toBe(true)
    })

    it('should return true for zero timestamp', () => {
      expect(isValidDate(0)).toBe(true)
    })

    it('should return false for NaN', () => {
      expect(isValidDate(NaN)).toBe(false)
    })

    it('should return false for Infinity', () => {
      expect(isValidDate(Infinity)).toBe(false)
    })
  })

  describe('other types', () => {
    it('should return false for null', () => {
      expect(isValidDate(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false)
    })

    it('should return false for boolean', () => {
      expect(isValidDate(true)).toBe(false)
    })

    it('should return false for object', () => {
      expect(isValidDate({})).toBe(false)
    })

    it('should return false for array', () => {
      expect(isValidDate([])).toBe(false)
    })
  })
})
