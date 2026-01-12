import { describe, expect, it } from 'vitest'
import { generateUUID } from '../../../shared/utils/generate-uuid'

describe('generateUUID', () => {
  it('should generate a valid UUID v4', () => {
    const uuid = generateUUID()
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(uuid).toMatch(uuidRegex)
  })

  it('should generate unique UUIDs', () => {
    const uuid1 = generateUUID()
    const uuid2 = generateUUID()
    expect(uuid1).not.toBe(uuid2)
  })

  it('should generate UUIDs of correct length', () => {
    const uuid = generateUUID()
    expect(uuid.length).toBe(36) // UUID v4 format: 8-4-4-4-12 = 36 characters
  })

  it('should generate multiple unique UUIDs', () => {
    const uuids = Array.from({ length: 100 }, () => generateUUID())
    const uniqueUuids = new Set(uuids)
    expect(uniqueUuids.size).toBe(100)
  })
})
