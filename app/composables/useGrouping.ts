// TODO: Fix worker version
// TODO: Initial collapse does not work for nested groups

// Models
import type { GroupItem } from '../models/group-item.model'

export function useGrouping() {
  const groupDataCore = <T>(
    rows: T[],
    groups: GroupItem<T>[],
    options?: {
      collapsed?: Record<string, boolean>
      useWorker?: boolean
      isInitialized?: boolean
    },
  ) => {
    const { collapsed = {}, useWorker, isInitialized } = options ?? {}

    return handleGroupData(rows, groups, collapsed, isInitialized)
  }

  const handleGroupData = <T>(
    rows: T[],
    groups: GroupItem<T>[],
    collapsed: Record<string, boolean>,
    isInitialized?: boolean,
  ) => {
    const valuesById: Record<string, IGroupRow> = {}
    const arr: Array<T | IGroupRow> = []

    for (let idx = 0; idx < rows.length; idx++) {
      let isCollapsed = false
      const row = rows[idx] as T

      let id = ''
      for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
        const group = groups[groupIdx] as GroupItem<T>

        const val = group.format ? group.format(row) : get(row, group.field)
        id += `_|_${val}`

        isCollapsed = !!(
          isCollapsed
          || !!collapsed[id]
          || (!isInitialized && group.initialCollapsed)
        )

        if (!collapsed[id] && !isInitialized && group.initialCollapsed) {
          collapsed[id] = true
        }

        if (valuesById[id] === undefined) {
          const label = typeof group.label === 'string'
            ? group.label
            : typeof group.label === 'function'
              ? group.label(val, group)
              : val

          const g: IGroupRow = {
            id,
            name: group.name,
            label,
            value: val,
            groupIdx,
            isGroup: true,
            data: [],
            dataObj: [],
          }

          valuesById[id] = g
          arr.push(g)

          if (isCollapsed) {
            const nextNonCollapsedRowIdx = rows
              .slice(idx + 1)
              .findIndex((row: any) => {
                const val = group.format
                  ? group.format(row)
                  : get(row, group.field)
                const isGroup = !isNil(groupIdx)

                return id !== (isGroup ? `_|_${val}` : val)
              })

            idx = nextNonCollapsedRowIdx > -1
              ? nextNonCollapsedRowIdx + idx
              : rows.length + 1

            break
          }
        }

        valuesById[id]?.data.push(idx)
        valuesById[id]?.dataObj.push(row)
      }

      if (!isCollapsed) {
        arr.push(row)
      }
    }

    return arr
  }

  const groupData = <T>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>>,
    options?: {
      collapsed?: Record<string, boolean>
      useWorker?: boolean
      isInitialized?: boolean
    },
  ) => {
    const rows = toValue(rowsRef)
    const groups = toValue(groupsRef)

    return groupDataCore(rows, groups, options)
  }

  return { groupData }
}
