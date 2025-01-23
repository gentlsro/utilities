import type { Required } from 'utility-types'

// Types
import type { ObjectKey } from '../types/object-key.type'

export class SortItem<T = any> {
  name: string | Extract<keyof T, string | number>
  field: ObjectKey<T>
  format?: (row: T) => any
  sort?: 'asc' | 'desc'
  sortFormat?: (row: T) => string | number | boolean
  sortOrder?: number

  constructor(obj: Required<Partial<SortItem<T>>, 'field'>) {
    this.field = obj.field
    this.name = obj.name ?? obj.field
    this.format = obj.format
    this.sort = obj.sort
    this.sortFormat = obj.sortFormat
    this.sortOrder = obj.sortOrder
  }
}
