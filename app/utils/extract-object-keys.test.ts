import { describe, expect, it } from 'vitest'

import { extractObjectKeys } from './extract-object-keys'

describe('extractObjectKeys', () => {
  it('stops at circular ancestors while preserving other paths', () => {
    const shared = { label: 'shared' }
    const root: Record<string, unknown> = {
      first: shared,
      second: shared,
    }
    root.self = root

    expect(extractObjectKeys(root, { keepObjectKeys: true })).toEqual([
      'first',
      'first.label',
      'second',
      'second.label',
    ])
  })

  it('stops before framework-owned graphs can overflow the stack', () => {
    const root: Record<string, unknown> = {}
    let current = root

    for (let depth = 0; depth < 100; depth += 1) {
      const child: Record<string, unknown> = {}
      current.child = child
      current = child
    }

    current.value = 'too deep'

    expect(extractObjectKeys(root)).toEqual([])
  })

  it('omits object subtrees instead of only hiding their parent path', () => {
    expect(extractObjectKeys({
      route: {
        fullPath: '/page',
        matched: { component: { internal: true } },
      },
    }, {
      keepObjectKeys: true,
      omitKeys: ['route.matched'],
    })).toEqual([
      'route',
      'route.fullPath',
    ])
  })
})
