import { describe, expect, it } from 'vitest'
import { emailPatternRegex } from '../../../shared/regex/email-pattern.regex'

describe('emailPatternRegex', () => {
  describe('valid emails', () => {
    it('should match simple email', () => {
      expect(emailPatternRegex.test('test@example.com')).toBe(true)
    })

    it('should match email with subdomain', () => {
      expect(emailPatternRegex.test('test@mail.example.com')).toBe(true)
    })

    it('should match email with numbers', () => {
      expect(emailPatternRegex.test('test123@example.com')).toBe(true)
    })

    it('should match email with dots in local part', () => {
      expect(emailPatternRegex.test('test.name@example.com')).toBe(true)
    })

    it('should match email with plus sign', () => {
      expect(emailPatternRegex.test('test+tag@example.com')).toBe(true)
    })

    it('should match email with quoted local part', () => {
      expect(emailPatternRegex.test('"test name"@example.com')).toBe(true)
    })

    it('should match email with hyphens', () => {
      expect(emailPatternRegex.test('test-name@example.com')).toBe(true)
    })

    it('should match email with multiple subdomains', () => {
      expect(emailPatternRegex.test('test@mail.sub.example.com')).toBe(true)
    })
  })

  describe('invalid emails', () => {
    it('should not match email without @', () => {
      expect(emailPatternRegex.test('testexample.com')).toBe(false)
    })

    it('should not match email without domain', () => {
      expect(emailPatternRegex.test('test@')).toBe(false)
    })

    it('should not match email without local part', () => {
      expect(emailPatternRegex.test('@example.com')).toBe(false)
    })

    it('should not match email with spaces', () => {
      expect(emailPatternRegex.test('test @example.com')).toBe(false)
    })

    it('should not match plain text', () => {
      expect(emailPatternRegex.test('not an email')).toBe(false)
    })

    it('should not match empty string', () => {
      expect(emailPatternRegex.test('')).toBe(false)
    })
  })
})
