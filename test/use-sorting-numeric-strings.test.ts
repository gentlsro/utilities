import { toValue } from 'vue'
import { get } from 'lodash-es'
import { describe, expect, it, vi } from 'vitest'

import { useSorting } from '../app/composables/useSorting'

vi.stubGlobal('toValue', toValue)
vi.stubGlobal('get', get)

// PostgreSQL sends numeric and bigint columns as strings ('188'), so rows from a saved SQL query reach a table with
// numbers in strings: they must sort by value, not as text (92, 78, 68 … 188)
describe('useSorting with numbers in strings', () => {
  const { sortData } = useSorting()
  const rows = [
    { page: '/features', duration: '92' },
    { page: '/', duration: '78' },
    { page: '/docs', duration: '188' },
    { page: '/about', duration: '57' },
    { page: '/pricing', duration: '102' },
    { page: '/refunds', duration: '-3.5' },
    { page: '/ratio', duration: '9.10' },
    { page: '/ratio2', duration: '9.9' },
  ]

  it('sorts numeric strings by value, highest first', async () => {
    const sorted = await sortData(rows, [{ field: 'duration', direction: 'desc' }] as any)
    expect(sorted.map(row => row.duration)).toEqual(['188', '102', '92', '78', '57', '9.9', '9.10', '-3.5'])
  })

  it('sorts numeric strings by value, lowest first', async () => {
    const sorted = await sortData(rows, [{ field: 'duration', direction: 'asc' }] as any)
    expect(sorted.map(row => row.duration)).toEqual(['-3.5', '9.10', '9.9', '57', '78', '92', '102', '188'])
  })

  it('still sorts text as text', async () => {
    const sorted = await sortData(rows, [{ field: 'page', direction: 'asc' }] as any)
    expect(sorted.map(row => row.page)).toEqual(['/', '/about', '/docs', '/features', '/pricing', '/ratio', '/ratio2', '/refunds'])
  })

  it('compares text that only starts with a number as text', async () => {
    const versions = [{ v: '10 items' }, { v: '9 items' }, { v: '2026-01-05' }]
    const sorted = await sortData(versions, [{ field: 'v', direction: 'asc' }] as any)
    expect(sorted.map(row => row.v)).toEqual(['10 items', '2026-01-05', '9 items'])
  })
})
