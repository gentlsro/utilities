import type { ObjectKey } from '../../shared/types/object-key.type'

export type IOrderBy<T> = {
  field: ObjectKey<T>
  direction: 'asc' | 'desc'
  sortOrder?: number | undefined
  filterField?: string
}
