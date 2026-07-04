// Types
import type { IItem } from '../../shared/types/item.type'

export type IGroupedItem<T = IItem> = {
  groupIdx: number

  ref: T
}
