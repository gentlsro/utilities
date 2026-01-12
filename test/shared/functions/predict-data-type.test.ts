import { describe, expect, it } from 'vitest'
import { predictDataType } from '../../../shared/functions/predict-data-type'

describe('predictDataType', () => {
  describe('number detection', () => {
    it('should predict number type from numeric values', () => {
      const rows = [
        { value: 123 },
        { value: 456 },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('number')
    })

    it('should predict numberSimple type when useSimple is true', () => {
      const rows = [
        { value: 123 },
        { value: 456 },
      ]
      expect(predictDataType({ rows, field: 'value', useSimple: true })).toBe('numberSimple')
    })

    it('should predict number from string numbers', () => {
      const rows = [
        { value: '123' },
        { value: '456' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('number')
    })

    it('should predict number from float strings', () => {
      const rows = [
        { value: '123.45' },
        { value: '456.78' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('number')
    })
  })

  describe('date detection', () => {
    it('should predict date type from Date instances', () => {
      const rows = [
        { value: new Date('2024-01-01') },
        { value: new Date('2024-01-02') },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('date')
    })

    it('should predict dateSimple type when useSimple is true', () => {
      const rows = [
        { value: new Date('2024-01-01') },
        { value: new Date('2024-01-02') },
      ]
      expect(predictDataType({ rows, field: 'value', useSimple: true })).toBe('dateSimple')
    })

    it('should predict date from date strings', () => {
      const rows = [
        { value: '2024-01-01' },
        { value: '2024-01-02' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('date')
    })
  })

  describe('boolean detection', () => {
    it('should predict boolean type from boolean values', () => {
      const rows = [
        { value: true },
        { value: false },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('boolean')
    })

    it('should predict booleanSimple type when useSimple is true', () => {
      const rows = [
        { value: true },
        { value: false },
      ]
      expect(predictDataType({ rows, field: 'value', useSimple: true })).toBe('booleanSimple')
    })

    it('should predict boolean from booleanish strings', () => {
      const rows = [
        { value: 'true' },
        { value: 'false' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('boolean')
    })
  })

  describe('string fallback', () => {
    it('should return string for non-numeric, non-date, non-boolean values', () => {
      const rows = [
        { value: 'hello' },
        { value: 'world' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('string')
    })

    it('should return string when all values are null', () => {
      const rows = [
        { value: null },
        { value: null },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('string')
    })

    it('should return string when all values are undefined', () => {
      const rows = [
        { value: undefined },
        { value: undefined },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('string')
    })
  })

  describe('priority order', () => {
    it('should prioritize number over other types', () => {
      const rows = [
        { value: 123 },
        { value: 'hello' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('number')
    })

    it('should prioritize date over boolean and string', () => {
      const rows = [
        { value: new Date('2024-01-01') },
        { value: 'hello' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('date')
    })

    it('should prioritize boolean over string', () => {
      const rows = [
        { value: true },
        { value: 'hello' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('boolean')
    })
  })

  describe('rowsToConsider option', () => {
    it('should only consider first N rows', () => {
      const rows = [
        { value: 123 },
        { value: 456 },
        { value: 'hello' },
      ]
      expect(predictDataType({ rows, field: 'value', rowsToConsider: 2 })).toBe('number')
    })

    it('should consider all rows when rowsToConsider is not provided', () => {
      const rows = [
        { value: 123 },
        { value: 'hello' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('number')
    })
  })

  describe('null/undefined handling', () => {
    it('should skip null values and check next row', () => {
      const rows = [
        { value: null },
        { value: 123 },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('number')
    })

    it('should skip undefined values and check next row', () => {
      const rows = [
        { value: undefined },
        { value: true },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('boolean')
    })

    it('should stop checking once dataType is found', () => {
      const rows = [
        { value: 123 },
        { value: null },
        { value: 'hello' },
      ]
      expect(predictDataType({ rows, field: 'value' })).toBe('number')
    })
  })
})
