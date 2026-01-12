import { describe, expect, it } from 'vitest'
import { isUrl } from '../../../shared/regex/url.regex'

describe('isUrl', () => {
  describe('URLs with protocol', () => {
    it('should return true for http URL', () => {
      expect(isUrl('http://example.com')).toBe(true)
    })

    it('should return true for https URL', () => {
      expect(isUrl('https://example.com')).toBe(true)
    })

    it('should return true for ftp URL', () => {
      expect(isUrl('ftp://example.com')).toBe(true)
    })

    it('should return true for URL with www', () => {
      expect(isUrl('http://www.example.com')).toBe(true)
    })

    it('should return true for URL with path', () => {
      expect(isUrl('https://example.com/path/to/page')).toBe(true)
    })

    it('should return true for URL with query parameters', () => {
      expect(isUrl('https://example.com?param=value')).toBe(true)
    })

    it('should return true for URL with both path and query', () => {
      expect(isUrl('https://example.com/path?param=value')).toBe(true)
    })

    it('should return true for URL with port', () => {
      expect(isUrl('http://example.com:8080')).toBe(true)
    })

    it('should return true for URL with special characters', () => {
      expect(isUrl('https://example.com/path%20with%20spaces')).toBe(true)
    })
  })

  describe('URLs without protocol', () => {
    it('should return true for www URL', () => {
      expect(isUrl('www.example.com')).toBe(true)
    })

    it('should return true for domain with path', () => {
      expect(isUrl('example.com/path')).toBe(true)
    })

    it('should return true for domain with query', () => {
      expect(isUrl('example.com?param=value')).toBe(true)
    })

    it('should return true for domain with both path and query', () => {
      expect(isUrl('example.com/path?param=value')).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('should return false for plain text', () => {
      expect(isUrl('not a url')).toBe(false)
    })

    it('should return false for email', () => {
      expect(isUrl('test@example.com')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isUrl('')).toBe(false)
    })

    it('should return false for just domain without TLD', () => {
      expect(isUrl('example')).toBe(false)
    })

    it('should return false for invalid protocol', () => {
      expect(isUrl('invalid://example.com')).toBe(false)
    })
  })
})
