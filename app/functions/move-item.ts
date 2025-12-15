export function moveItem<T>(
  arrayRef: MaybeRefOrGetter<T[]>,
  fromIndex: number,
  toIndex: number,
): T[] {
  const array = toValue(arrayRef)

  if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex > array.length) {
    throw new Error('Index out of bounds')
  }

  const item = array[fromIndex] as T

  // Remove the item from the original position
  const newArray = array.toSpliced(fromIndex, 1)

  // Insert the item into the adjusted position
  return newArray.toSpliced(toIndex, 0, item)
}
