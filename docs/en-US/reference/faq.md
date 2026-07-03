---
title: Utilities FAQ
description: Answers about defaults, limits, and integration in libs/Utilities.
navigation: true
category: reference
order: 2
---

# FAQ

## Does Utilities auto-import helpers?

Yes. Nuxt config auto-imports `app/models`, `app/enums`, `app/regex`, `app/constants`, `app/functions`, `app/composables`.

## How do I extend Utilities configuration?

Create `utilities-config.ts` in your layer root. Export a default config with `extendUtilitiesConfig()`. You can also extend `ComparatorEnum` and `DataType` in the same file.

## Does file upload work out of the box?

Yes. Default `uploadHandler` uses `uploadFile()`, which posts to `runtimeConfig.public.filesHost` (default `/api/files`). Override `files.uploadHandler` in `utilities-config.ts` for custom handlers (e.g. `useFn`).

## Does file deletion work out of the box?

No. Default `deleteFile()` only logs. Override `files.deleteHandler` for real deletion.

## Are worker-based search, sort, or group paths active?

No. Worker code is commented out. Runs in-process.

## How does string normalization work in search and filter?

`useSearching()` and `useFiltering()` use `normalizeText()` or `transliterate()` based on `utilsConfig.general.transliterate`.

## How does date equality work in filters?

Date equality uses `$date(...).isSame(..., 'day')` — day-based, not full timestamp.

## What does `predictDataType()` return for mixed or sparse data?

Inspects rows in order; skips null/undefined. Returns first detected type: number → date → boolean → string. With `useSimple`, returns `*Simple` variant.

## What is the median behavior in summaries?

`SummaryEnum.MEDIAN` returns `values[Math.floor(values.length / 2)]`. Even-length arrays do not average the middle two.

## Which locale is the default?

No single default: `config.ts` uses `en-US`; `locales.constant.ts` has `LOCALE_DEFAULT = 'cs-CZ'`. Verify your entry point.

## Assumptions / TODO

- FAQ covers only questions answerable from inspected code.

## Source Evidence

- `libs/Utilities/nuxt.config.ts`, `config.ts`, `modules/utilities.module.ts`
- `libs/Utilities/app/utils/upload-file.ts`, `delete-file.ts`
- `libs/Utilities/app/composables/useSearching.ts`, `useFiltering.ts`, `useSorting.ts`, `useGrouping.ts`
- `libs/Utilities/app/functions/predict-data-type.ts`
- `libs/Utilities/app/composables/useSummaries.ts`
- `libs/Utilities/app/enums/summary.enum.ts`
- `libs/Utilities/app/i18n/locales.constant.ts`
