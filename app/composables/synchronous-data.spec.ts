import { describe, expect, it } from 'vitest'
import { useSorting } from './useSorting'
import { useSearching } from './useSearching'

describe('synchronous data initialization and existing async contracts', () => {
  it('sorts groups and formatted values stably without mutating source rows', async () => {
    const rows = [
      { id: 1, group: 'b', value: 2 },
      { id: 2, group: 'a', value: 1 },
      { id: 3, group: 'a', value: 3 },
      { id: 4, group: 'a', value: 3 },
    ]
    const source = [...rows]
    const columns = [{ name: 'value', field: 'value' as const, sort: 'desc' as const }]
    const groups = [{ name: 'group', field: 'group' as const, sort: 'asc' as const }]
    const { sortData, sortDataSync } = useSorting()
    const result = sortDataSync({ rowsRef: rows, columnsRef: columns, groupsRef: groups })
    expect(result.map(row => row.id)).toEqual([3, 4, 2, 1])
    expect(rows).toEqual(source)
    expect(result[0]).toBe(rows[2])
    const asyncResult = sortData(rows, columns, groups)
    expect(asyncResult).toBeInstanceOf(Promise)
    expect(await asyncResult).toEqual(result)
  })

  it('searches before the first render while preserving row identity and async results', async () => {
    const rows = [{ id: 1, label: 'Alpha' }, { id: 2, label: 'Beta' }, { id: 3, label: 'Alphabet' }]
    const payload = {
      rowsRef: rows,
      searchRef: '^al',
      fuseOptions: { keys: ['label'], useExtendedSearch: true },
    }
    const { searchData, searchDataSync } = useSearching()
    const result = searchDataSync(payload)
    expect(result.map(hit => hit.item.id)).toEqual([1, 3])
    expect(result[0]?.item).toBe(rows[0])
    expect(result[1]?.item).toBe(rows[2])
    const asyncResult = searchData(payload)
    expect(asyncResult).toBeInstanceOf(Promise)
    expect(await asyncResult).toEqual(result)
    expect(rows.map(row => row.id)).toEqual([1, 2, 3])
  })
})
