import { get } from 'lodash-es'

export type FindInNestedResult<T> = { item: T, parent: T | undefined }

export function findInNested<T>(
  options: {
    items: T[]
    childrenKey?: string
    predicate: (item: T) => boolean
  },
): FindInNestedResult<T> | undefined {
  const { items, childrenKey = 'children', predicate } = options ?? {}

  for (const item of items) {
    if (predicate(item)) {
      return { item, parent: undefined }
    }

    const children = get(item, childrenKey) as T[] | undefined

    if (Array.isArray(children)) {
      const found = findInNested({ items: children, childrenKey, predicate })

      if (found !== undefined) {
        return { item: found.item, parent: found.parent ?? item }
      }
    }
  }

  return undefined
}
