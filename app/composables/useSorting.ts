// TODO: Fix worker version

// Types
import type { IItem } from '../../shared/types/item.type'

// Models
import type { GroupItem } from '../models/group-item.model'
import type { SortItem } from '../models/sort-item.model'

type WorkerValue = {
  idx: number
  valueByGroupName: Record<string, any>
  valueByColumnName: Record<string, any>
}

const SORT_MAP = { asc: 1, desc: -1 }

// A plain number in a string ('188', '-3.5'): PostgreSQL sends numeric and bigint columns this way
const NUMERIC_STRING = /^\s*[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?\s*$/i

function compareValues(aValue: any, bValue: any) {
  if (typeof aValue === 'string' && typeof bValue === 'string') {
    if (NUMERIC_STRING.test(aValue) && NUMERIC_STRING.test(bValue)) {
      return Math.sign(Number(aValue) - Number(bValue))
    }

    return aValue.localeCompare(bValue)
  }

  if (aValue > bValue) {
    return 1
  }

  if (aValue < bValue) {
    return -1
  }

  return 0
}

export function useSorting() {
  const sortDataCore = <T = IItem>(
    rows: T[],
    cols: Array<SortItem<T> | IOrderBy<T>>,
    groups: GroupItem<T>[] = [],
  ): Array<T> => {
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
        const compared = compareValues(a.valueByGroupName[g.name], b.valueByGroupName[g.name])

        if (compared) {
          return compared * SORT_MAP[g.sort || 'asc']
        }
      }

      for (let idx = 0; idx < sortCols.length; idx++) {
        const s = sortCols[idx] as SortItem<T>
        const compared = compareValues(a.valueByColumnName[s.name as string], b.valueByColumnName[s.name as string])

        if (compared) {
          return compared * SORT_MAP[s.sort || 'asc']
        }
      }

      return 0
    })

    return values.map(({ idx }) => rows[idx]) as T[]
  }

  const sortDataSync = <T = IItem>(payload: {
    rowsRef: MaybeRefOrGetter<Array<T>>
    columnsRef: MaybeRefOrGetter<Array<SortItem<T> | IOrderBy<T>>>
    groupsRef?: MaybeRefOrGetter<Array<GroupItem<T>>>
  }): Array<T> => {
    const rows = [...toValue(payload.rowsRef)]
    const cols = toValue(payload.columnsRef)
    const groups = toValue(payload.groupsRef ?? [])

    return sortDataCore(rows, cols, groups)
  }

  // Preserve the asynchronous public API for existing consumers.
  const sortData = async <T = IItem>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    columnsRef: MaybeRefOrGetter<Array<SortItem<T> | IOrderBy<T>>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>> = [],
    _useWorker?: boolean,
  ): Promise<Array<T>> => {
    return sortDataSync({ rowsRef, columnsRef, groupsRef })
  }

  return { sortData, sortDataSync }
}
