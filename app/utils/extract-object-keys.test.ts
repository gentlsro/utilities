import { describe, expect, it } from 'vitest'
import { extractObjectKeys } from './extract-object-keys'

describe('extractObjectKeys', () => {
  it('preserves path order, prefix and first-item array sampling', () => {
    expect(extractObjectKeys({
      name: 'Jane',
      details: { active: true },
      roles: [{ name: 'Admin', scopes: ['read'] }, { ignored: true }],
      empty: [],
      unset: undefined,
      nullable: null,
    }, { prefix: 'record', keepObjectKeys: true })).toEqual([
      'record',
      'record.name',
      'record.details',
      'record.details.active',
      'record.roles.[n]',
      'record.roles.[n].name',
      'record.roles.[n].scopes.[n]',
      'record.unset',
      'record.nullable',
    ])
  })

  it('retains descendants of omitted object paths and suffix matching', () => {
    expect(extractObjectKeys({
      route: { matched: { name: 'page' }, path: '/' },
      metadata: { path: '/hidden' },
    }, { keepObjectKeys: true, omitKeys: ['matched', 'path'] })).toEqual([
      'route',
      'route.matched.name',
      'metadata',
    ])
  })

  it('preserves leaf-only extraction and empty-object behavior', () => {
    expect(extractObjectKeys({ nested: { value: 1 }, empty: {}, list: [null] })).toEqual([
      'nested.value',
      'list.[n]',
    ])
    expect(extractObjectKeys({}, { prefix: 'root', keepObjectKeys: true })).toEqual(['root'])
    expect(extractObjectKeys([], { prefix: 'root', keepObjectKeys: true })).toEqual([])
    expect(extractObjectKeys(1)).toEqual([])
    expect(extractObjectKeys(1, { prefix: 'root' })).toEqual(['root'])
  })

  it('skips circular ancestors without losing shared-object paths', () => {
    const shared: Record<string, unknown> = { label: 'shared' }
    const root = { first: shared, second: shared, tail: true }
    shared.parent = root

    expect(extractObjectKeys(root, { keepObjectKeys: true })).toEqual([
      'first',
      'first.label',
      'second',
      'second.label',
      'tail',
    ])
  })

  it('handles circular and shared arrays', () => {
    const cycle: unknown[] = []
    cycle.push(cycle)
    const shared = [{ name: 'same item' }]
    expect(extractObjectKeys({ cycle, first: shared, second: shared })).toEqual([
      'first.[n].name',
      'second.[n].name',
    ])
  })

  it('preserves deeply nested fields without exhausting the call stack', () => {
    const root: Record<string, unknown> = {}
    let current = root
    for (let depth = 0; depth < 20_000; depth++) {
      const child = {}
      current.child = child
      current = child
    }
    current.value = 'deep field'

    expect(extractObjectKeys(root)).toEqual([`${'child.'.repeat(20_000)}value`])
  })

  it('applies an explicit depth limit to objects and array elements', () => {
    expect(extractObjectKeys({
      flat: 1,
      nested: { value: 2, deeper: { value: 3 } },
      rows: [{ value: 4 }],
    }, { maxDepth: 2, keepObjectKeys: true })).toEqual([
      'flat',
      'nested',
      'nested.value',
      'nested.deeper',
      'rows.[n]',
    ])
    expect(extractObjectKeys({ value: 1 }, { prefix: 'root', keepObjectKeys: true, maxDepth: 0 })).toEqual(['root'])
  })

  it('does not read values below an explicit depth limit', () => {
    const value = { get inaccessible() {
      throw new Error('should not read')
    } }
    const array = [1]
    Object.defineProperty(array, '0', { get() {
      throw new Error('should not read')
    } })
    expect(extractObjectKeys(value, { maxDepth: 0 })).toEqual([])
    expect(extractObjectKeys(array, { maxDepth: 0 })).toEqual([])
  })

  it.each([-1, 0.5, Number.NaN, Number.NEGATIVE_INFINITY])('rejects invalid depth limit %s', maxDepth => {
    expect(() => extractObjectKeys({}, { maxDepth })).toThrow(RangeError)
  })
})
