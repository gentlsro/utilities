// TODO: Fix worker version
// TODO: Initial collapse does not work for nested groups

// Models
import type { GroupItem } from '../models/group-item.model'

export function useGrouping() {
  const groupData = <T>(
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
            // Skip rows if they are part of collapsed group
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

  // const handleGroupDataInWorker = async <T>(
  //   rowsRef: MaybeRefOrGetter<Array<T>>,
  //   groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>>,
  //   collapsed: Record<string, boolean>,
  // ) => {
  //   const rows = toValue(rowsRef)
  //   const groups = toValue(groupsRef)

  //   const rowsRelevantData = rows.map<Record<string, any>>(row => {
  //     return groups.reduce<Record<string, any>>((agg, group) => {
  //       const val = group.format ? group.format(row) : get(row, group.field)
  //       agg[group.name] = val

  //       return agg
  //     }, {})
  //   })

  //   const arr = await workerFnGroupData(
  //     rowsRelevantData,
  //     JSON.parse(JSON.stringify(groups)),
  //     JSON.parse(JSON.stringify(collapsed)),
  //   )

  //   return arr.map(row => {
  //     if (typeof row === 'object') {
  //       const group = groups[row.groupIdx] as GroupItem<T>

  //       row.label = typeof group.label === 'string'
  //         ? group.label
  //         : typeof group.label === 'function'
  //           ? group.label(row.value, group)
  //           : (row.value as string)

  //       return row
  //     }

  //     return rows[row]
  //   })
  // }

  // const { workerFn: workerFnGroupData } = useWebWorkerFn(
  //   <T>(
  //     rows: T[],
  //     groups: GroupItem<T>[],
  //     collapsed: Record<string, boolean>,
  //   ) => {
  //     const valuesById: Record<string, IGroupRow> = {}
  //     const arr: Array<number | IGroupRow> = []

  //     for (let idx = 0; idx < rows.length; idx++) {
  //       const row = rows[idx] as T
  //       let isCollapsed = false

  //       let id = ''
  //       for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
  //         const group = groups[groupIdx] as GroupItem<T>

  //         const val = row[group.name as keyof T]
  //         id += groupIdx ? `_|_${val}` : val
  //         isCollapsed = isCollapsed || !!collapsed[id]

  //         if (valuesById[id] === undefined) {
  //           const g: IGroupRow = {
  //             id,
  //             name: group.name,
  //             label: '',
  //             value: val,
  //             groupIdx,
  //             isGroup: true,
  //             data: [],
  //             dataObj: [],
  //           }

  //           valuesById[id] = g
  //           arr.push(g)

  //           if (isCollapsed) {
  //             // Skip rows if they are part of collapsed group
  //             const nextNonCollapsedRowIdx = rows
  //               .slice(idx + 1)
  //               .findIndex((row: any) => {
  //                 const val = row[group.name as keyof T]

  //                 return id !== (groupIdx ? `_|_${val}` : val)
  //               })

  //             idx = nextNonCollapsedRowIdx > -1
  //               ? nextNonCollapsedRowIdx + idx
  //               : rows.length + idx

  //             break
  //           }
  //         }

  //         valuesById[id]?.data.push(idx)
  //         valuesById[id]?.dataObj.push(row)
  //       }

  //       if (!isCollapsed) {
  //         arr.push(idx)
  //       }
  //     }

  //     return arr
  //   },
  // )

  return { groupData }
}
