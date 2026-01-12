import { describe, expect, it } from 'vitest'
import { isBooleanish } from '../../../shared/functions/is-booleanish'

describe('isBooleanish', () => {
  it('should return true for boolean true', () => {
    expect(isBooleanish(true)).toBe(true)
  })

  it('should return true for boolean false', () => {
    expect(isBooleanish(false)).toBe(true)
  })

  it('should return true for string "true"', () => {
    expect(isBooleanish('true')).toBe(true)
  })

  it('should return true for string "false"', () => {
    expect(isBooleanish('false')).toBe(true)
  })

  it('should return true for string "TRUE" (case insensitive)', () => {
    expect(isBooleanish('TRUE')).toBe(true)
  })

  it('should return true for string "FALSE" (case insensitive)', () => {
    expect(isBooleanish('FALSE')).toBe(true)
  })

  it('should return true for string "True" (case insensitive)', () => {
    expect(isBooleanish('True')).toBe(true)
  })

  it('should return true for string with spaces " true " (trimmed)', () => {
    expect(isBooleanish(' true ')).toBe(true)
  })

  it('should return true for string with spaces " false " (trimmed)', () => {
    expect(isBooleanish(' false ')).toBe(true)
  })

  it('should return false for string "yes"', () => {
    expect(isBooleanish('yes')).toBe(false)
  })

  it('should return false for string "no"', () => {
    expect(isBooleanish('no')).toBe(false)
  })

  it('should return false for number 1', () => {
    expect(isBooleanish(1)).toBe(false)
  })

  it('should return false for number 0', () => {
    expect(isBooleanish(0)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isBooleanish(null)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isBooleanish(undefined)).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isBooleanish('')).toBe(false)
  })

  it('should return false for object', () => {
    expect(isBooleanish({})).toBe(false)
  })

  it('should return false for array', () => {
    expect(isBooleanish([])).toBe(false)
  })
})
