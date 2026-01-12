import { describe, expect, it } from 'vitest'
import { formatValue } from '../../../shared/utils/format-value'

describe('formatValue', () => {
  it('should return value as-is (current implementation)', () => {
    expect(formatValue('test')).toBe('test')
    expect(formatValue(123)).toBe(123)
    expect(formatValue(true)).toBe(true)
    expect(formatValue(null)).toBe(null)
    expect(formatValue(undefined)).toBe(undefined)
  })

  it('should return value with row parameter', () => {
    const row = { id: 1 }
    expect(formatValue('test', row)).toBe('test')
  })

  it('should return value with options parameter', () => {
    expect(formatValue('test', undefined, {})).toBe('test')
  })

  it('should return value with all parameters', () => {
    const row = { id: 1 }
    const options = {}
    expect(formatValue('test', row, options)).toBe('test')
  })
})
