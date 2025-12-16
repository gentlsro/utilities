// Models
import type { SortItem } from '../../shared/models/sort-item.model'
import type { GroupItem } from '../../shared/models/group-item.model'

// Functions
import { useSorting as useSortingShared } from '../../shared/composables/useSorting'

export function useSorting() {
  const { sortData: sortDataShared } = useSortingShared()

  const sortData = async <T = IItem>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    columnsRef: MaybeRefOrGetter<Array<SortItem<T> | IOrderBy<T>>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>> = [],
    useWorker?: boolean,
  ): Promise<Array<T>> => {
    const rows = [...toValue(rowsRef)]
    const cols = toValue(columnsRef)
    const groups = toValue(groupsRef)

    return sortDataShared(rows, cols, groups, useWorker)
  }

  return { sortData }
}
