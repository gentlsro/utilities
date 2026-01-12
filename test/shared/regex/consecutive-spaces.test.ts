import { beforeEach, describe, expect, it } from 'vitest'
import { consecutiveSpacesRegex } from '../../../shared/regex/consecutive-spaces.regex'

describe('consecutiveSpacesRegex', () => {
  beforeEach(() => {
    consecutiveSpacesRegex.lastIndex = 0
  })
  describe('matching consecutive spaces', () => {
    it('should match two consecutive spaces', () => {
      expect(consecutiveSpacesRegex.test('hello  world')).toBe(true)
    })

    it('should match three consecutive spaces', () => {
      expect(consecutiveSpacesRegex.test('hello   world')).toBe(true)
    })

    it('should match many consecutive spaces', () => {
      expect(consecutiveSpacesRegex.test('hello        world')).toBe(true)
    })

    it('should match consecutive spaces at start', () => {
      expect(consecutiveSpacesRegex.test('  hello')).toBe(true)
    })

    it('should match consecutive spaces at end', () => {
      expect(consecutiveSpacesRegex.test('hello  ')).toBe(true)
    })

    it('should match multiple groups of consecutive spaces', () => {
      expect(consecutiveSpacesRegex.test('hello  world  test')).toBe(true)
    })
  })

  describe('not matching single spaces', () => {
    it('should not match single space', () => {
      expect(consecutiveSpacesRegex.test('hello world')).toBe(false)
    })

    it('should not match string without spaces', () => {
      expect(consecutiveSpacesRegex.test('helloworld')).toBe(false)
    })

    it('should not match empty string', () => {
      expect(consecutiveSpacesRegex.test('')).toBe(false)
    })

    it('should not match string with only single spaces', () => {
      expect(consecutiveSpacesRegex.test('hello world test')).toBe(false)
    })
  })

  describe('replacement usage', () => {
    it('should replace consecutive spaces with single space', () => {
      const result = 'hello  world'.replace(consecutiveSpacesRegex, ' ')
      expect(result).toBe('hello world')
    })

    it('should replace multiple consecutive spaces with single space', () => {
      const result = 'hello     world'.replace(consecutiveSpacesRegex, ' ')
      expect(result).toBe('hello world')
    })

    it('should replace all groups of consecutive spaces', () => {
      const result = 'hello  world  test'.replace(consecutiveSpacesRegex, ' ')
      expect(result).toBe('hello world test')
    })
  })
})
