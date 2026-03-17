---
title: Utilities API Reference
description: API reference for verified public symbols in libs/Utilities.
navigation: true
category: reference
order: 1
---

# API Reference

## Module and configuration

### `extendUtilitiesConfig(config)`

Typed wrapper for extending utilities config. Merging happens at build time in the Utilities module.

**Correct usage**

From `libs/Core/utilities-config.ts`:

```ts
export default extendUtilitiesConfig({
  general: { domain: import.meta.dev ? undefined : '.gentl.tech' },
  files: {
    uploadHandler: async ({ file, requestHandler, onComplete, headers }) => {
      const handler = requestHandler ?? useFn().fn
      const res = await handler(async () => await uploadFile({ file, headers }))
      file.uploadProgress = 100
      for await (const onUploadComplete of file.onUploadCompleteQueue ?? []) {
        await onUploadComplete(res.data.uploadedFiles[0])
      }
      onComplete?.(res)
      return res
    },
  },
})
```

### Generated aliases

- `$utilsConfig` — merged config from all layers
- `$comparatorEnum` — merged comparator enum
- `$dataType` — merged `ExtendedDataType`

### `IUtilitiesConfig`

`general`, `dataTypeExtend`, `logging`, `files`, `request`, `fn`

## Value, date, number, duration

### `useDateUtils(localeIso?)`

Shared: `formatDate()`, `formatTime()`, `parseDate()`, `getPeriod()`, etc. App version uses `useLocale()`.

### `useNumber({ localeIso? })`

`parseNumber()`, `formatNumber()`, `formatCurrency()`, `formatBytes()`. `formatCurrency()` appends currency string; `parseNumber()` returns `0` for invalid input.

**Correct usage**

From `libs/UI/app/components/Table/TableTotalRows.vue`:

```ts
const { formatNumber } = useNumber()

// In template:
{ { formatNumber(totalRows) } }
```

### `useDuration({ localeIso? })`

`formatDuration()`, `getDuration()`, `MODIFIER_BY_UNIT`. Auto unit: millisecond, second, minute, hour, day.

**Correct usage**

From `libs/UI/app/components/Inputs/DurationInput/DurationInput.vue`:

```ts
import { MODIFIER_BY_UNIT } from '#layers/utilities/shared/composables/useDuration'

const { getDuration } = useDuration()

const modelByUnit = computed(() => ({
  year: getDuration(model, 'year').val,
  month: getDuration(model, 'month').val,
  day: getDuration(model, 'day').val,
  hour: getDuration(model, 'hour').val,
  minute: getDuration(model, 'minute').val,
  second: getDuration(model, 'second').val,
  millisecond: getDuration(model, 'millisecond').val,
}))

// Convert back: val * MODIFIER_BY_UNIT[durationUnit.value]
```

### `formatValue(value, row?, options?)`

Options: `dataType`, `predictDataType`, `format`, `emptyValue`, `localeIso`, `dateFormat`.

**Correct usage**

From `libs/UI/app/components/ValueFormatter/ValueFormatter.vue`:

```ts
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

### `parseValue(value, dataType?, options?)`

Options: `predictDataType`, `dateFormat`, `timezone`. Strips `Simple` suffix.

### `getFast(obj, path, defaultValue?)`

Nested read. Path: dot-string or segment array.

**Correct usage**

```ts
getFast(obj, 'user.name')
getFast(obj, 'user.address.street', 'No address')
getFast(obj, ['user', 'name'])
```

### `setFast(obj, path, value)`

Mutates object; creates missing intermediates. Throws if `obj` is null/undefined or not plain object.

**Correct usage**

From `libs/DynamicGrid/app/components/BuildingBlock/BuildingBlockConfiguration/BuildingBlockConfigurationContentDimensions.vue`:

```ts
set: val => setFast(buildingBlock.value, `${props.prefix}top`, castToPx(val))
set: val => setFast(buildingBlock.value, `${props.prefix}paddingLeft`, castToPx(val))
```

### Other utilities

`generateUUID()`, `cleanValue()`, `replaceNonAlphanumeric()`, `removeDatetimeSpaces()`, `isNumeric()`, `isBooleanish()`, `isValidDate()`, `isUrl()`

## Row data

### Models

`FilterItem`, `SortItem`, `GroupItem`, `SummaryItem`. `FilterItem.filterDbQuery` returns `undefined` when `value` is empty.

### `useSearching()` → `searchData(payload)`

**Correct usage**

From `libs/DynamicGrid/app/composables/useDynamicGridElementsSearch.ts`:

```ts
const { searchData } = useSearching()

const res = await searchData({
  searchRef: search ?? '',
  rowsRef: nodesFiltered,
  fuseOptions: { keys: ['ref.uuid'], useExtendedSearch: true },
  fuseSearchToken: "'",
})
return res.map(r => r.item)
```

**Incorrect usage**

```ts
// Missing fuseOptions.keys — Fuse.js requires it
searchData({ searchRef: q, rowsRef: rows })
```

### `useFiltering()` → `filterData()`, `handleFilter()`

**Correct usage**

From `libs/UI/app/composables/useTableDataClient.ts`:

```ts
const { filterData } = useFiltering()
const filtered = filterData(dataRef, columnFilters || [])
```

### `useSorting()` → `sortData()`

**Correct usage**

From `libs/UI/app/composables/useTableDataClient.ts`:

```ts
const { sortData } = useSorting()
const rows = await sortData(filtered, orderBy || [])
```

### `useGrouping()` → `groupData()`

Creates synthetic group rows with `isGroup: true`, `id`, `label`, `data`, `dataObj`. Nested collapse not supported.

### `useSummaries()` → `createSummaries()`

COUNT, SUM, MEDIAN, AVERAGE. MEDIAN uses `values[Math.floor(values.length / 2)]` — no average of middle pair for even-length.

## File and navigation

### `FileModel`

Properties: `name`, `type`, `isUploading`, `isUploaded`, `path`, `uploadProgress`, `hasError`, `uploadedFile`. Methods: `upload()`, `delete()`, `cancelUpload()`.

**Correct usage**

From `libs/UI/app/components/Inputs/FileInput/functions/useFileInput.ts`:

```ts
const filesArray = Array.from(files).map(file => new FileModel({ file }))
model.value = props.multi ? [...(model.value || []), ...filesArray] : filesArray
```

From `libs/Core/app/pages/playground/fs.vue`:

```ts
const files = ref<FileModel[]>([])
async function handleUpload() {
  for (const file of files.value) await file.upload()
}
```

### `useFiles(name?)`

Returns: `files`, `allFiles`, `injectedFiles`, `clearFiles()`

### `uploadFile({ file })` / `deleteFile({ file })`

`uploadFile` posts to `runtimeConfig.public.filesHost`. `deleteFile` default only logs — override `files.deleteHandler` for real delete.

## Validation

### Zod

`useZod()`, `useZodOld()`, `buildZodFromJson()`, `translateZodIssue`, `ZOD_VALIDATORS`. `useZod` requires `libs/UI`.

### ArkType

`arkError()`, `translateArkError()`

## Assumptions / TODO

- Selective reference; many exports not expanded. Verify in source before treating as stable API.

## Source Evidence

- `libs/Utilities/config.ts`, `modules/utilities.module.ts`
- `libs/Utilities/shared/composables/useDateUtils.ts`, `useNumber.ts`, `useDuration.ts`
- `libs/Utilities/shared/utils/format-value.ts`, `parse-value.ts`, `get-fast.ts`, `set-fast.ts`
- `libs/Utilities/shared/models/filter-item.model.ts`, `sort-item.model.ts`, `group-item.model.ts`, `summary-item.model.ts`
- `libs/Utilities/app/composables/useSearching.ts`, `useFiltering.ts`, `useSorting.ts`, `useGrouping.ts`, `useSummaries.ts`, `useFiles.ts`, `useZod.ts`
- `libs/Utilities/app/models/file.model.ts`
- `libs/UI/app/components/Inputs/DurationInput/DurationInput.vue`
- `libs/UI/app/components/Table/TableTotalRows.vue`
- `libs/UI/app/components/ValueFormatter/ValueFormatter.vue`
- `libs/DynamicGrid/app/composables/useDynamicGridElementsSearch.ts`
- `libs/DynamicGrid/app/components/BuildingBlock/BuildingBlockConfiguration/BuildingBlockConfigurationContentDimensions.vue`
- `libs/UI/app/composables/useTableDataClient.ts`
- `libs/UI/app/components/Inputs/FileInput/functions/useFileInput.ts`
- `libs/Core/app/pages/playground/fs.vue`
- `libs/Core/utilities-config.ts`
