import type { ObjectKey } from './object-key.type'

export type IOrderBy<T> = {
  field: ObjectKey<T>
  direction: 'asc' | 'desc'
  sortOrder?: number | undefined
  filterField?: string
}
