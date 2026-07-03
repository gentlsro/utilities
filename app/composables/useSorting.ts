// TODO: Fix worker version

// Types
import type { IItem } from '../types/item.type'

// Models
import type { GroupItem } from '../models/group-item.model'
import type { SortItem } from '../models/sort-item.model'

type WorkerValue = {
  idx: number
  valueByGroupName: Record<string, any>
  valueByColumnName: Record<string, any>
}

const SORT_MAP = { asc: 1, desc: -1 }

export function useSorting() {
  const sortDataCore = async <T = IItem>(
    rows: T[],
    cols: Array<SortItem<T> | IOrderBy<T>>,
    groups: GroupItem<T>[] = [],
    useWorker?: boolean,
  ): Promise<Array<T>> => {
    const sortCols = cols
      .filter(col => 'direction' in col || col.sort)
      .map(col => {
        if ('direction' in col) {
          return {
            field: col.field,
            name: col.field,
            sort: col.direction,
            format: undefined,
            sortFormat: undefined,
          }
        }

        return col
      })

    const values = rows.map<WorkerValue>((r, idx) => ({
      idx,
      valueByGroupName: groups.reduce<Record<string, any>>((agg, group) => {
        agg[group.name] = group.sortFormat
          ? group.sortFormat(r)
          : group.format
            ? group.format(r)
            : (get(r, group.field) as string | number | boolean)

        return agg
      }, {}),
      valueByColumnName: sortCols.reduce<Record<string, any>>((agg, col) => {
        agg[col.name as string] = col.sortFormat
          ? col.sortFormat(r)
          : col.format
            ? col.format(r)
            : (get(r, col.field) as string | number | boolean)

        return agg
      }, {}),
    }))

    values.sort((a, b) => {
      for (let idx = 0; idx < groups.length; idx++) {
        const g = groups[idx] as GroupItem<T>
        const aValue = a.valueByGroupName[g.name]
        const bValue = b.valueByGroupName[g.name]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const stringCompare = aValue.localeCompare(bValue)

          if (stringCompare) {
            return stringCompare * SORT_MAP[g.sort || 'asc']
          }
        } else {
          if (aValue > bValue) {
            return SORT_MAP[g.sort || 'asc'] * 1
          }

          if (aValue < bValue) {
            return SORT_MAP[g.sort || 'asc'] * -1
          }
        }
      }

      for (let idx = 0; idx < sortCols.length; idx++) {
        const s = sortCols[idx] as SortItem<T>
        const aValue = a.valueByColumnName[s.name as string]
        const bValue = b.valueByColumnName[s.name as string]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const stringCompare = aValue.localeCompare(bValue)

          if (stringCompare) {
            return stringCompare * SORT_MAP[s.sort || 'asc']
          }
        } else {
          if (aValue > bValue) {
            return SORT_MAP[s.sort || 'asc'] * 1
          }

          if (aValue < bValue) {
            return SORT_MAP[s.sort || 'asc'] * -1
          }
        }
      }

      return 0
    })

    return values.map(({ idx }) => rows[idx]) as T[]
  }

  const sortData = async <T = IItem>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    columnsRef: MaybeRefOrGetter<Array<SortItem<T> | IOrderBy<T>>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>> = [],
    useWorker?: boolean,
  ): Promise<Array<T>> => {
    const rows = [...toValue(rowsRef)]
    const cols = toValue(columnsRef)
    const groups = toValue(groupsRef)

    return sortDataCore(rows, cols, groups, useWorker)
  }

  return { sortData }
}
