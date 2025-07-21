import type { Required } from 'utility-types'
import type { ObjectKey } from '../types/object-key.type'

export class GroupItem<T = any> {
  name: string | ObjectKey<T>
  label?: string | ((value: any, group: GroupItem<T>) => string)
  field: ObjectKey<T>
  initialCollapsed?: boolean
  format?: (row: T) => any
  sortFormat?: (row: T) => string | number | boolean
  filterFormat?: (row: T) => any
  sort?: 'asc' | 'desc'
  style?: Record<string, string> | string
  class?: (
    row?: T,
    val?: string | number
  ) => Record<string, boolean> | string | string[]

  constructor(obj: Required<Partial<GroupItem<T>>, 'field'>) {
    this.label = obj.label
    this.field = obj.field
    this.name = obj.name ?? (this.field as ObjectKey<T>)
    this.initialCollapsed = obj.initialCollapsed ?? false
    this.format = obj.format
    this.sortFormat = obj.sortFormat
    this.filterFormat = obj.filterFormat
    this.sort = obj.sort
    this.style = obj.style
    this.class = obj.class
  }
}
