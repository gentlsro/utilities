import type { FuseResult } from 'fuse.js'
import type { Required } from 'utility-types'
import type { FuseOptions } from '@vueuse/integrations/useFuse.mjs'

// Functions
import { useSearching as useSearchingShared } from '../../shared/composables/useSearching'

export function useSearching() {
  const { searchData: searchDataShared } = useSearchingShared()

  const searchData = async <T extends IItem>(payload: {
    searchRef?: MaybeRefOrGetter<string>
    rowsRef: MaybeRefOrGetter<Array<T>>
    columnsRef?: MaybeRefOrGetter<Array<IItem>>
    fuseOptions: Required<FuseOptions<any>, 'keys'>
    useWorker?: boolean
    normalizeFnc?: (val: string) => string

    /**
     * The extended search token for fuse.js library
     * https://www.fusejs.io/examples.html#extended-search
     */
    fuseSearchToken?: "'" | '=' | '!' | '^' | '!^' | '$' | '!$'

    /**
     * For some cases, we need to know if the search result has "exact match"
     * (~ the search value is exactly the same as the item label)
     *
     * We leverage usage of object reference here to mutate it in-place, so we
     * can get the value back in the internal list function.
     *
     * In short, if there is an "exact match", you should set `_extra.hasExactMatch = true`
     */
    _extra?: { hasExactMatch?: boolean }
  }): Promise<FuseResult<T>[]> => {
    const {
      searchRef,
      rowsRef,
      columnsRef,

      ...options
    } = payload

    const search = toValue(searchRef)
    const rows = toValue(rowsRef)
    const columns = toValue(columnsRef)

    return searchDataShared({
      search,
      rows,
      columns,
      ...options,
    })
  }

  return {
    searchData,
  }
}
