export type ITreeNode<T extends IItem = IItem> = IItem<T> & {
  /**
   * Unique ID of the node
   */
  id: string | number

  /**
   * Name of the node
   */
  name: string

  /**
   * Children of the node
   *
   * NOTE: You should use empty array instead of `undefined` if you don't want
   * the item to have the "expand" button
   */
  children?: ITreeNode<T>[]
}
