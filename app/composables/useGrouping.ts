// Models
import type { GroupItem } from '../../shared/models/group-item.model'

// Functions
import { useGrouping as useGroupingShared } from '../../shared/composables/useGrouping'

export function useGrouping() {
  const { groupData: groupDataShared } = useGroupingShared()

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

    return groupDataShared(rows, groups, options)
  }

  return { groupData }
}
