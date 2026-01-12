import { describe, expect, it } from 'vitest'
import { replaceNonAlphanumeric } from '../../../shared/functions/replace-non-alphanumeric'

describe('replaceNonAlphanumeric', () => {
  describe('default replacement character (-)', () => {
    it('should replace non-alphanumeric characters with dash', () => {
      expect(replaceNonAlphanumeric('hello world!')).toBe('hello-world')
    })

    it('should replace multiple consecutive special characters with single dash', () => {
      expect(replaceNonAlphanumeric('hello!!!world')).toBe('hello-world')
    })

    it('should remove leading and trailing dashes', () => {
      expect(replaceNonAlphanumeric('!hello world!')).toBe('hello-world')
    })

    it('should handle string with only special characters', () => {
      expect(replaceNonAlphanumeric('!!!')).toBe('')
    })

    it('should handle string with spaces', () => {
      expect(replaceNonAlphanumeric('hello world test')).toBe('hello-world-test')
    })

    it('should handle string with numbers', () => {
      expect(replaceNonAlphanumeric('hello123world')).toBe('hello123world')
    })

    it('should handle mixed case', () => {
      expect(replaceNonAlphanumeric('Hello World')).toBe('Hello-World')
    })

    it('should handle empty string', () => {
      expect(replaceNonAlphanumeric('')).toBe('')
    })
  })

  describe('custom replacement character', () => {
    it('should replace with custom character', () => {
      expect(replaceNonAlphanumeric('hello world!', '_')).toBe('hello_world')
    })

    it('should replace multiple consecutive with single custom character', () => {
      expect(replaceNonAlphanumeric('hello!!!world', '_')).toBe('hello_world')
    })

    it('should remove leading and trailing custom character', () => {
      expect(replaceNonAlphanumeric('!hello world!', '_')).toBe('hello_world')
    })

    it('should handle custom character that needs escaping', () => {
      expect(replaceNonAlphanumeric('hello.world', '.')).toBe('hello.world')
    })
  })

  describe('edge cases', () => {
    it('should handle string with only alphanumeric characters', () => {
      expect(replaceNonAlphanumeric('hello123world')).toBe('hello123world')
    })

    it('should handle string with unicode characters', () => {
      expect(replaceNonAlphanumeric('hello-世界-world')).toBe('hello-world')
    })

    it('should handle string with newlines and tabs', () => {
      expect(replaceNonAlphanumeric('hello\nworld\ttest')).toBe('hello-world-test')
    })

    it('should handle complex string with multiple special characters', () => {
      expect(replaceNonAlphanumeric('test@example.com')).toBe('test-example-com')
    })
  })
})
