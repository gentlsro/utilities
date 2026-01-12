import { describe, expect, it } from 'vitest'
import { passwordRegex } from '../../../shared/regex/password.regex'

describe('passwordRegex', () => {
  describe('valid passwords', () => {
    it('should match password with lowercase, uppercase, and digit', () => {
      expect(passwordRegex.test('Password1')).toBe(true)
    })

    it('should match password with 8 characters minimum', () => {
      expect(passwordRegex.test('Abcdef1')).toBe(false) // 7 chars
      expect(passwordRegex.test('Abcdef12')).toBe(true) // 8 chars
    })

    it('should match password with multiple digits', () => {
      expect(passwordRegex.test('Password123')).toBe(true)
    })

    it('should match password with multiple uppercase letters', () => {
      expect(passwordRegex.test('PASSWORD1a')).toBe(true)
    })

    it('should match password with multiple lowercase letters', () => {
      expect(passwordRegex.test('password1')).toBe(false) // no uppercase
      expect(passwordRegex.test('Password1')).toBe(true) // has uppercase and lowercase
    })

    it('should match longer passwords', () => {
      expect(passwordRegex.test('MySecurePassword123')).toBe(true)
    })
  })

  describe('invalid passwords', () => {
    it('should not match password without lowercase', () => {
      expect(passwordRegex.test('PASSWORD1')).toBe(false) // No lowercase
      expect(passwordRegex.test('PASSWORD')).toBe(false) // No digit and no lowercase
    })

    it('should not match password without uppercase', () => {
      expect(passwordRegex.test('password1')).toBe(false)
    })

    it('should not match password without digit', () => {
      expect(passwordRegex.test('Password')).toBe(false)
    })

    it('should not match password shorter than 8 characters', () => {
      expect(passwordRegex.test('Pass1')).toBe(false)
      expect(passwordRegex.test('Pass12')).toBe(false)
      expect(passwordRegex.test('Pass123')).toBe(false)
    })

    it('should not match password with special characters only', () => {
      expect(passwordRegex.test('!@#$%^&*')).toBe(false)
    })

    it('should not match password with spaces', () => {
      expect(passwordRegex.test('Password 1')).toBe(false)
    })

    it('should not match empty string', () => {
      expect(passwordRegex.test('')).toBe(false)
    })

    it('should not match password with only letters', () => {
      expect(passwordRegex.test('Password')).toBe(false)
    })

    it('should not match password with only numbers', () => {
      expect(passwordRegex.test('12345678')).toBe(false)
    })
  })
})
