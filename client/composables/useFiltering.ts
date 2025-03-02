import { useFiltering as useFilteringShared } from '../../shared/composables/useFiltering'

// Models
import type { FilterItem } from '../../shared/models/filter-item'

type IFilter<T> = Pick<
  FilterItem<T>,
  | 'field'
  | 'filterField'
  | 'value'
  | 'comparator'
  | 'dataType'
  | 'filteredKeys'
  | 'filterFormat'
  | 'format'
>

export function useFiltering() {
  const { filterData: filterDataShared, handleFilter } = useFilteringShared()

  function filterData<T = IItem>(
    dataRef: MaybeRefOrGetter<T[]>,
    filtersRef: MaybeRefOrGetter<IFilter<T>[]>,
    rowKey = 'id',

    options?: {
      /**
       * When true, the function will not stop after the first invalid filter
       */
      runAll?: boolean

      /**
       * When provided, the function will be called when a filter is invalid
       */
      onInvalid?: (filter: any, row: T) => void
    },
  ) {
    const data = toValue(dataRef)
    const filters = toValue(filtersRef)

    return filterDataShared(data, filters, rowKey, options)
  }

  return {
    filterData,
    handleFilter,
  }
}
