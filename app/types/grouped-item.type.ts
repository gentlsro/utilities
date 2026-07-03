// Types
import type { IItem } from './item.type'

export type IGroupedItem<T = IItem> = {
  groupIdx: number

  ref: T
}
