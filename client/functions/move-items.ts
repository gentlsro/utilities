import { klona } from 'klona/full'

export function moveItems<T = any>(payload: {
  arrayRef: Ref<T[]>
  toMoveRef: MaybeRefOrGetter<T[]>
  toIndex: number
}) {
  const { arrayRef, toIndex, toMoveRef } = payload
  let items = klona(toValue(arrayRef))
  const toMove = toValue(toMoveRef)

  const splicedItems: T[] = []
  toMove.forEach(item => {
    // @ts-expect-error
    const currentIndex = items.findIndex(_item => _item.id === item.id)

    const splicedItem = items[currentIndex] as T
    items = items.toSpliced(currentIndex, 1, { _moved: true } as any)
    splicedItems.push(splicedItem)
  })

  items = items.toSpliced(
    toIndex,
    0,
    ...splicedItems,
  )

  return items.filter(item => !(item as any)._moved)
}
