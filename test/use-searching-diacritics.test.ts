import { toValue } from 'vue'
import { get } from 'lodash-es'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSearching } from '../app/composables/useSearching'

vi.stubGlobal('toValue', toValue)
vi.stubGlobal('get', get)

let transliterate = true
vi.stubGlobal('useRuntimeConfig', () => ({ public: { transliterate } }))

/**
 * A search finds a label whatever its diacritics: "tlaci" finds "Tlačítko" (the add-block menu found nothing, as the
 * transliteration, on by default, dropped the í). Failure modes:
 *  D1 a letter with diacritics outside the transliteration's map (í, á, é, ů, ř, ä) is dropped instead of becoming its
 *     base letter, so the search without diacritics misses the label;
 *  D2 the search with diacritics misses the label written without them;
 *  D3 Cyrillic is no longer found by its latin transliteration (нож by noz);
 *  D4 without transliteration (runtimeConfig.public.transliterate: false), diacritics still matter;
 *  D5 a normalizeFnc the caller gives (the List's searchConfig.normalizeFnc) is ignored.
 */
const rows = [{ label: 'Tlačítko' }, { label: 'Gitlab úkoly' }, { label: 'Tlačítko pro nahrání souboru' }, { label: 'Kůň' }, { label: 'Nadpis' }, { label: 'нож' }, { label: 'Rucni' }]

async function search(text: string, normalizeFnc?: (val: string) => string) {
  const { searchData } = useSearching()
  const found = await searchData({
    searchRef: text,
    rowsRef: rows,
    fuseOptions: { keys: ['label'], threshold: 0, ignoreLocation: true, useExtendedSearch: true },
    fuseSearchToken: '\'',
    ...(normalizeFnc && { normalizeFnc }),
  })

  return found.map(result => result.item.label)
}

describe.each([true, false])('a search with transliteration %s', on => {
  beforeEach(() => {
    transliterate = on
  })

  it('finds a label with diacritics by its letters without them (D1, D4)', async () => {
    expect(await search('tlaci')).toEqual(expect.arrayContaining(['Tlačítko', 'Tlačítko pro nahrání souboru']))
    expect(await search('ukoly')).toEqual(['Gitlab úkoly'])
    expect(await search('kun')).toEqual(['Kůň'])
  })

  it('finds a label without diacritics by its letters with them (D2)', async () => {
    expect(await search('ruční')).toEqual(['Rucni'])
  })
})

describe('transliteration', () => {
  beforeEach(() => {
    transliterate = true
  })

  it('still finds Cyrillic by its latin letters (D3)', async () => {
    expect(await search('noz')).toEqual(['нож'])
  })

  it('uses the caller\'s normalizeFnc (D5)', async () => {
    // (one that keeps diacritics: they matter again)
    const lowerCase = (val: string) => val.toLowerCase()
    expect(await search('tlaci', lowerCase)).toEqual([])
    expect(await search('tlačí', lowerCase)).toEqual(expect.arrayContaining(['Tlačítko', 'Tlačítko pro nahrání souboru']))
  })
})
