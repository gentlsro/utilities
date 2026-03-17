---
title: Utilities Common Patterns
description: Verified usage patterns for value handling, row data, files, and validation in libs/Utilities.
navigation: true
category: guides
order: 2
---

# Common Patterns

## Format typed values

Use `predictDataType()` when rows lack explicit type; pass result to `parseValue()` or `formatValue()`.

**Correct usage**

From `libs/UI/app/components/ValueFormatter/ValueFormatter.vue`:

```ts
const { currentLocale } = useLocale()

const formattedValue = computed(() => {
  return formatValue(props.value, props.row, {
    dataType: props.dataType,
    format: props.format,
    emptyValue: props.emptyValue,
    predictDataType: props.predictDataType,
    comparator: props.comparator,
    localeIso: currentLocale.value.code,
  })
})
```

Pass `localeIso` from `useLocale()` for locale-aware output.

## Search, filter, sort rows

**Correct usage**

From `libs/DynamicGrid/app/composables/useDynamicGridElementsSearch.ts`:

```ts
const { searchData } = useSearching()

const handleSearch = async (search, nodes) => {
  const res = await searchData({
    searchRef: search ?? '',
    rowsRef: nodesFiltered,
    fuseOptions: { keys: ['ref.uuid'], useExtendedSearch: true },
    fuseSearchToken: "'",
  })
  return res.map(r => r.item)
}
```

From `libs/UI/app/composables/useTableDataClient.ts`:

```ts
const { sortData } = useSorting()
const { filterData } = useFiltering()

const filtered = filterData(dataRef, columnFilters || [])
const rows = await sortData(filtered, orderBy || [])
```

Apply filter first, then sort. Provide `fuseOptions.keys` for search.

## Manage file upload state

**Correct usage**

From `libs/UI/app/components/Inputs/FileInput/functions/useFileInput.ts`:

```ts
function handleAddFile(files: FileList | File[] | null) {
  if (!files) return
  const filesArray = Array.from(files).map(file => new FileModel({ file }))
  if (props.multi) {
    model.value = [...(model.value || []), ...filesArray]
  } else {
    model.value = filesArray
  }
}
```

From `libs/Core/app/pages/playground/fs.vue`:

```ts
const files = ref<FileModel[]>([])

async function handleUpload() {
  for (const file of files.value) {
    await file.upload()
  }
}
```

## Source Evidence

- `libs/Utilities/shared/functions/predict-data-type.ts`, `shared/utils/parse-value.ts`, `format-value.ts`
- `libs/Utilities/shared/composables/useSearching.ts`, `useFiltering.ts`, `useSorting.ts`, `useGrouping.ts`
- `libs/Utilities/app/composables/useSummaries.ts`, `useFiles.ts`
- `libs/Utilities/app/models/file.model.ts`
- `libs/DynamicGrid/app/composables/useDynamicGridElementsSearch.ts`
- `libs/UI/app/composables/useTableDataClient.ts`
- `libs/UI/app/components/ValueFormatter/ValueFormatter.vue`
- `libs/UI/app/components/Inputs/FileInput/functions/useFileInput.ts`
- `libs/Core/app/pages/playground/fs.vue`
