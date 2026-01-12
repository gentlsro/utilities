import { describe, expect, it } from 'vitest'
import { removeDatetimeSpaces } from '../../../shared/functions/remove-datetime-spaces'

describe('removeDatetimeSpaces', () => {
  it('should remove spaces between date numbers', () => {
    const input = 'Čtvrtek 29. 05. 2025'
    const expected = 'Čtvrtek 29.05.2025'
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })

  it('should remove multiple spaces between date numbers', () => {
    const input = 'Pondělí 01. 02. 2024'
    const expected = 'Pondělí 01.02.2024'
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })

  it('should handle time format spaces', () => {
    const input = '12: 30: 45'
    const expected = '12:30:45'
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })

  it('should handle combined date and time', () => {
    const input = 'Čtvrtek 29. 05. 2025 12: 30'
    const expected = 'Čtvrtek 29.05.2025 12:30'
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })

  it('should not remove spaces that are not between digits', () => {
    const input = 'Monday January 1 2024'
    const expected = 'Monday January 1 2024'
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })

  it('should handle string without spaces to remove', () => {
    const input = '29.05.2025'
    const expected = '29.05.2025'
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })

  it('should handle empty string', () => {
    expect(removeDatetimeSpaces('')).toBe('')
  })

  it('should handle string with only spaces', () => {
    const input = '   '
    const expected = '   '
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })

  it('should handle complex datetime format', () => {
    const input = 'Neděle 15. 12. 2024 14: 30: 00'
    const expected = 'Neděle 15.12.2024 14:30:00'
    expect(removeDatetimeSpaces(input)).toBe(expected)
  })
})
