/**
 * Goes through the tree via `children` property, for each node, callback is
 * called to handle the node
 */
export function traverseChildren<T extends IItem>(
  nodes: IItem<T>[] | undefined,
  callback: (
    parentNode: IItem<T> | null,
    currentNode: IItem<T>,
    idx: number
  ) => void,
  options: { childrenField?: string, childIdx?: number } = {},
  parentNode?: IItem<T>,
) {
  const { childrenField = 'children', childIdx } = options

  nodes?.forEach((node, idx) => {
    if (node[childrenField]) {
      callback(parentNode || null, node, childIdx ?? idx)

      node[childrenField].forEach((childNode: IItem<T>, childIdx: number) => {
        traverseChildren(
          [childNode],
          callback,
          { ...options, childIdx },
          node,
        )
      })
    } else {
      callback(parentNode || null, node, childIdx ?? idx)
    }
  })
}
