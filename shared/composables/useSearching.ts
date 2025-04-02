import utilsConfig from '$utilsConfig'
import Fuse, { type FuseResult } from 'fuse.js'
import { klona } from 'klona/full'
import type { Required } from 'utility-types'
import type { FuseOptions } from '@vueuse/integrations/useFuse'

// Functions
import { useText } from './useText'
import { transliterate } from '../functions/transliterate'

export function removeDots(str: string) {
  return str.replace(/\./g, '')
}

export function removeCommas(str: string) {
  if (typeof str === 'string') {
    return str.replace(/,/g, '')
  }

  return str
}

export function useSearching() {
  const { normalizeText } = useText()

  const searchData = async <T extends IItem>(payload: {
    searchRef?: MaybeRefOrGetter<string>
    rowsRef: MaybeRefOrGetter<Array<T>>
    fuseOptions: Required<FuseOptions<any>, 'keys'>
    columnsRef?: MaybeRefOrGetter<Array<IItem>>
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
      fuseOptions,
      fuseSearchToken,
      columnsRef,
      useWorker,
      _extra,
    } = payload

    const normalizeFnc = utilsConfig.general.transliterate
      ? transliterate
      : normalizeText

    const search = normalizeFnc(toValue(searchRef) ?? '')
    const rows = toValue(rowsRef)
    const columns = toValue(columnsRef)
    const optionsClone = klona(fuseOptions)

    if (!search) {
      return rows.map((row, idx) => ({ item: row, refIndex: idx }))
    }

    const pattern = fuseOptions.useExtendedSearch && fuseSearchToken
      ? `${fuseSearchToken}"${search}"`
      : search

    // Extract relevant data from the rows based on keys
    // Also resolve possible formats if `format` fnc is present
    const colsByName = columns?.reduce((agg, col) => {
      const colName = col.name as ObjectKey<T>
      agg[colName] = col

      return agg
    }, {} as Record<ObjectKey<T> | string, IItem<T>>)

    const columnsRelevant = (optionsClone.keys as unknown as string[]).map((key, idx) => {
      const col = colsByName?.[key]
      if (col) {
        return col
      }

      if (typeof key === 'function') {
        return { field: `_${idx}`, name: `_${idx}`, format: key }
      }

      return { name: key, field: key as any }
    })

    const rowsRelevantData = rows.map<Record<string, any>>(row => {
      return columnsRelevant.reduce<Record<string, any>>((agg, col) => {
        console.log(row, col)
        console.log('🚀 ~ useSearching ~ removeDots(col.name):', removeDots(col.name), get(row, col.field))

        agg[removeDots(col.name)] = normalizeFnc(
          removeCommas(
            'format' in col && col.format
              ? col.format(row, get(row, col.field))
              : get(row, col.field),
          ),
        )

        return agg
      }, {})
    })

    // We need to remove dots from keys, because we've removed them above in the reducer
    // and fuse.js would do it again, so the search would not work properly
    optionsClone.keys = columnsRelevant.map(col => removeDots(col.name))

    let result: FuseResult<T>[] = []

    if (useWorker) {
      workerTerminate()

      await nextTick()
      result = await workerFn(pattern, rowsRelevantData, optionsClone) as FuseResult<T>[]
    } else {
      result = handleSearch(pattern, rowsRelevantData, optionsClone) as FuseResult<T>[]
    }

    if (_extra) {
      _extra.hasExactMatch = result.some(item => {
        return item.matches?.some(match => match.value === search)
      })
    }

    return result.map(item => {
      item.item = rows[item.refIndex] as T

      return item
    })
  }

  const handleSearchInWorker = <T extends IItem>(
    pattern: string,
    rowsRelevantData: T[],
    options: Required<FuseOptions<any>, 'keys'>,
  ) => {
    options = { threshold: 0.4, ...options, includeScore: true }
    const fuse = new Fuse(rowsRelevantData, options)

    // @ts-expect-error Weird fuse.js typing
    return fuse.search(pattern, options)
  }

  const handleSearch = <T extends IItem>(
    pattern: string,
    items: T[],
    options: Required<FuseOptions<any>, 'keys'>,
  ) => {
    options = { threshold: 0.4, ...options, includeScore: true }

    const fuse = new Fuse(items, options)

    // @ts-expect-error Weird fuse.js typing
    return fuse.search(pattern, options)
  }

  // XXX: Manually check for updates for dependency
  const { workerFn, workerTerminate } = useWebWorkerFn(handleSearchInWorker, {
    dependencies: ['https://cdn.jsdelivr.net/npm/fuse.js@7.0.0'],
    timeout: 1e5, // 100 sec
  })

  return {
    searchData,
  }
}
