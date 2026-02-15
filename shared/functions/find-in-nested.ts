import { get } from 'lodash-es'

export function findInNested<T>(
  options: {
    items: T[]
    childrenKey?: string
    predicate: (item: T) => boolean
  },
): T | undefined {
  const { items, childrenKey = 'children', predicate } = options ?? {}

  for (const item of items) {
    if (predicate(item)) {
      return item
    }

    const children = get(item, childrenKey) as T[] | undefined

    if (Array.isArray(children)) {
      const found = findInNested({ items: children, childrenKey, predicate })

      if (found !== undefined) {
        return found
      }
    }
  }

  return undefined
}
