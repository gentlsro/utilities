---
title: Utilities
description: Nuxt utility library for build-time config generation, locale-aware value helpers, table data operations, file handling, and validation glue.
navigation: true
category: libraries
order: 1
---

# Utilities

`libs/Utilities` provides build-time configuration generation and runtime helpers for formatting, parsing, searching, filtering, sorting, grouping, summaries, files, navigation, and validation.

## What the Library Exposes

### Nuxt integration and generated aliases

- Nuxt config auto-imports: `app/models`, `shared/models`, `shared/enums`, `shared/regex`, `shared/constants`, `shared/functions`
- Nitro imports `shared/composables` on the server
- Module generates: `$utilsConfig`, `$comparatorEnum`, `$dataType` (merged from all layers)

### Runtime areas

- **Locale-aware**: `useDateUtils()`, `useNumber()`, `useDuration()`
- **Value handling**: `formatValue()`, `parseValue()`, `predictDataType()`
- **Row data**: `useSearching()`, `useFiltering()`, `useSorting()`, `useGrouping()`, `useSummaries()`
- **Files**: `FileModel`, `useFiles()`, `uploadFile()`, `deleteFile()`
- **Validation**: `useZod()`, `buildZodFromJson()`, ArkType helpers
- **Utilities**: `getFast()`, `setFast()`, `generateUUID()`, `cleanValue()`, `isNumeric()`, etc.

## Notable constraints

- Worker-based search/sort/group: commented out; runs in-process
- Grouping: initial collapse does not work for nested groups
- Default `deleteFile()`: only logs; does not send delete request
- `useZod()`: depends on `libs/UI` (validation store)

## Assumptions / TODO

- Not an exhaustive symbol reference. Repository-level layer registration not documented.

## Source Evidence

- `libs/Utilities/nuxt.config.ts`, `config.ts`, `modules/utilities.module.ts`
- `libs/Utilities/shared/composables/useFiltering.ts`, `useSearching.ts`, `useSorting.ts`, `useGrouping.ts`
- `libs/Utilities/app/composables/useSummaries.ts`, `useFiles.ts`, `useZod.ts`
- `libs/Utilities/app/models/file.model.ts`, `app/utils/upload-file.ts`, `delete-file.ts`
- `libs/Core/utilities-config.ts`, `utilities-config.ts`
