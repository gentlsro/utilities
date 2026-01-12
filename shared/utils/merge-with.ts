export function mergeWith<T extends IItem>(payload: {
  rootItems: T[]
  nestedItems: T[]
  key: string
  mergeFnc: (payload: { rootItem?: T, nestedItem?: T }) => T | T[]
}) {
  const { rootItems, nestedItems, key, mergeFnc } = payload

  const rootItemByName = rootItems.reduce((agg, item) => {
    agg[get(item, key)] = item

    return agg
  }, {} as Record<string, T>)

  const nestedItemByName = nestedItems
    .reduce((agg, item) => {
      agg[get(item, key)] = item

      return agg
    }, {} as Record<string, T>)

  const usedKeys = new Set<string>()

  return [...rootItems, ...nestedItems]
    .flatMap(item => {
      if (usedKeys.has(get(item, key))) {
        return undefined
      }

      usedKeys.add(get(item, key))

      return mergeFnc({
        rootItem: rootItemByName[get(item, key)],
        nestedItem: nestedItemByName[get(item, key)],
      })
    })
    .filter(Boolean) as T[]
}
