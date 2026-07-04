// TODO: Fix worker version
import Fuse from 'fuse.js'
import type { FuseResult } from 'fuse.js'
import { klona } from 'klona/full'
import utilsConfig from '$utilsConfig'

// Types
import type { IItem } from '../../shared/types/item.type'
import type { ObjectKey } from '../../shared/types/object-key.type'

// Functions
import { useText } from './useText'
import { transliterate } from '../utils/transliterate'

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

  const searchDataCore = async <T extends IItem>(payload: {
    search?: string
    rows: T[]
    columns?: IItem[]
    fuseOptions: IFuseOptions
    useWorker?: boolean
    normalizeFnc?: (val: string) => string
    transliterate?: boolean
    fuseSearchToken?: "'" | '=' | '!' | '^' | '!^' | '$' | '!$'
    _extra?: { hasExactMatch?: boolean }
  }): Promise<FuseResult<T>[]> => {
    const {
      search: searchString = '',
      rows,
      columns,
      fuseOptions,
      fuseSearchToken,
      transliterate: shouldTransliterate = false,
      _extra,
    } = payload

    const normalizeFnc = shouldTransliterate
      ? transliterate
      : normalizeText

    const search = normalizeFnc(searchString)
    const optionsClone = klona(fuseOptions)

    if (!search) {
      return rows.map((row, idx) => ({ item: row, refIndex: idx }))
    }

    const pattern = fuseOptions.useExtendedSearch && fuseSearchToken
      ? `${fuseSearchToken}"${search}"`
      : search

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
        agg[removeDots(col.name)] = normalizeFnc(
          removeCommas(
            'format' in col && col.format
              ? String(col.format(row, get(row, col.field)))
              : String(get(row, col.field)),
          ),
        )

        return agg
      }, {})
    })

    optionsClone.keys = columnsRelevant.map(col => removeDots(col.name))

    let result: FuseResult<T>[] = []

    result = handleSearch(pattern, rowsRelevantData, optionsClone) as FuseResult<T>[]

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

  const handleSearch = <T extends IItem>(
    pattern: string,
    items: T[],
    options: IFuseOptions,
  ) => {
    options = { threshold: 0.4, ...options, includeScore: true }

    const fuse = new Fuse(items, options)

    // @ts-expect-error Weird fuse.js typing
    return fuse.search(pattern, options)
  }

  const searchData = async <T extends IItem>(payload: {
    searchRef?: MaybeRefOrGetter<string>
    rowsRef: MaybeRefOrGetter<Array<T>>
    columnsRef?: MaybeRefOrGetter<Array<IItem>>
    fuseOptions: IFuseOptions
    useWorker?: boolean
    normalizeFnc?: (val: string) => string
    fuseSearchToken?: "'" | '=' | '!' | '^' | '!^' | '$' | '!$'
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

    return searchDataCore({
      search,
      rows,
      columns,
      transliterate: utilsConfig.general.transliterate,
      ...options,
    })
  }

  return {
    searchData,
  }
}
