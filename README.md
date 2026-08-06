# Utilities

Nuxt layer with shared app helpers: value format/parse, data types, filter/search/sort/group, files, i18n, and related composables/models.

Add it to `extends` in `nuxt.config.ts`.

## Extending config

Create `app/utilities-config.ts` and export a default via `extendUtilitiesConfig`.
Layer configs are _merged_ at build time.

```ts
export default extendUtilitiesConfig({
  general: {
    domain: import.meta.dev ? undefined : '.example.com',
  },
  files: {
    uploadHandler: async ({ file, /* ... */ }) => {
      // custom upload
    },
  },
})

export type DataType = 'enum'

export enum ComparatorEnum {
  HAS_SOME = 'hasSome',
}
```

You can also extend `ComparatorEnum` and `DataType` in the same file.
