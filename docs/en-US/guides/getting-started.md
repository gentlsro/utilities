---
title: Utilities Getting Started
description: Start from the generated config and runtime helpers that libs/Utilities exposes.
navigation: true
category: guides
order: 1
---

# Getting Started

## Extending utilities configuration

Base layer uses `config.ts`; other layers use `utilities-config.ts`. The module merges configs at build time.

**Correct usage**

From `libs/Core/utilities-config.ts`:

```ts
export default extendUtilitiesConfig({
  general: {
    domain: import.meta.dev ? undefined : '.gentl.tech',
  },
  files: {
    uploadHandler: async ({ file, requestHandler, onComplete, headers }) => {
      const handler = requestHandler ?? useFn().fn
      if (!handler) {
        throw new Error('Request handler not found')
      }

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

enum ComparatorEnum {
  HAS_SOME = 'hasSome',
}
```

## What is auto-imported

- `app/models`, `app/enums`, `app/regex`, `app/constants`, `app/functions`, `app/composables`

## Common first APIs

- **Value**: `formatValue()`, `parseValue()`, `predictDataType()`, `useDateUtils()`, `useNumber()`, `useDuration()`
- **Row data**: `useSearching().searchData()`, `useFiltering().filterData()`, `useSorting().sortData()`, `useGrouping().groupData()`, `useSummaries().createSummaries()`
- **Files**: `FileModel`, `useFiles()`, default upload to `runtimeConfig.public.filesHost`

## Caveats

- Default `deleteFile()` only logs. Override `files.deleteHandler` for real delete.
- `useZod()` requires `libs/UI`.
- Locale defaults vary: `config.ts` uses `en-US`; `locales.constant.ts` has `cs-CZ`.

## Assumptions / TODO

- Assumes `libs/Utilities` is in the Nuxt layer stack.

## Source Evidence

- `libs/Utilities/config.ts`, `modules/utilities.module.ts`, `nuxt.config.ts`
- `libs/Core/utilities-config.ts`
- `libs/Utilities/app/utils/format-value.ts`, `parse-value.ts`
- `libs/Utilities/app/composables/useFiles.ts`, `useSummaries.ts`, `useZod.ts`
- `libs/Utilities/app/models/file.model.ts`, `app/utils/upload-file.ts`, `delete-file.ts`
