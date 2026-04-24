import { describe, expect, it } from 'vitest'
import { mergeFast } from '../../../shared/utils/merge-fast'

describe('mergeFast', () => {
  it('should mutate target object', () => {
    const target = { item: { title: 'Old' } }
    const patch = { item: { description: 'New' } }

    const result = mergeFast(target, patch)

    expect(result).toBe(target)
    expect(target).toEqual({
      item: {
        title: 'Old',
        description: 'New',
      },
    })
  })

  it('should keep explicit undefined values from patch', () => {
    const target = {
      item: {
        title: 'Old',
        subtitle: 'Keep?',
      },
    }
    const patch = {
      item: {
        subtitle: undefined,
      },
    }

    mergeFast(target, patch)

    expect(target.item).toHaveProperty('subtitle', undefined)
  })

  it('should replace arrays instead of merging by index', () => {
    const target = { items: [1, 2, 3] }
    const patch = { items: [9] }

    mergeFast(target, patch)

    expect(target.items).toEqual([9])
  })

  it('should keep explicit undefined on root level', () => {
    const target = {
      title: 'Old',
      subtitle: 'Old subtitle',
    }
    const patch = {
      subtitle: undefined,
    }

    mergeFast(target, patch)

    expect(target).toHaveProperty('subtitle', undefined)
  })
})
