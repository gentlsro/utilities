import { createResolver } from 'nuxt/kit'
import { join } from 'node:path'

const { resolve } = createResolver(import.meta.url)
const isMonorepo = import.meta.env.VITE_MONOREPO === 'true'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [],

  // Modules https://nuxt.com/docs/api/configuration/nuxt-config#modules
  modules: [
    resolve('./modules/utilities.module'),
    resolve('./modules/lodash.module'),
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    'dayjs-nuxt',
  ],

  // SSR https://nuxt.com/docs/api/configuration/nuxt-config#ssr
  // ssr: false,

  // Imports https://nuxt.com/docs/api/configuration/nuxt-config#imports
  imports: {
    imports: [
      { name: 'z', from: 'zod/v4' },

      // Client
      { name: 'getComponentName', from: resolve('./client/functions/get-component-name.ts') },
      { name: '$t', from: resolve('./client/functions/$t.ts') },
      { name: '$p', from: resolve('./client/functions/$p.ts') },
      { name: '$nav', from: resolve('./client/functions/$nav.ts') },
      { name: 'injectStrict', from: resolve('./client/functions/inject-strict.ts') },

      // Shared
      { name: 'generateUUID', from: resolve('./shared/functions/generate-uuid.ts') },
      { name: '$date', from: resolve('./client/functions/dayjs.ts') },
      { name: '$duration', from: resolve('./client/functions/dayjs.ts') },
      { name: '$log', from: resolve('./shared/functions/$log.ts') },
      { name: 'IItem', from: resolve('./shared/types/item.type.ts'), type: true },
      { name: 'ClassType', from: resolve('./client/types/class.type.ts'), type: true },
      { name: 'Datetime', from: resolve('./shared/types/datetime.type.ts'), type: true },
      { name: 'extendUtilitiesConfig', from: resolve('./config.ts') },
      { name: 'isDev', from: resolve('./shared/functions/is-dev.ts') },
      { name: 'resolveComponentByName', from: resolve('./client/functions/resolve-component-by-name.ts') },
    ],
  },

  // Devtools https://nuxt.com/docs/api/configuration/nuxt-config#devtools
  devtools: {
    enabled: isMonorepo,
  },

  // Src dir https://nuxt.com/docs/api/configuration/nuxt-config#srcdir
  srcDir: 'client/',

  // Alias
  alias: {
    $utils: join(process.cwd(), 'generated', 'utils.ts'),
    $utilsConfig: join(process.cwd(), 'generated', 'utilsConfig.ts'),
    $utilsLayer: resolve('.'),
    $comparatorEnum: join(process.cwd(), 'generated', 'comparator-enum.ts'),
    $dataType: join(process.cwd(), 'generated', 'data-type.type.ts'),
    $components: join(process.cwd(), 'generated', 'components-by-name.ts'),
  },

  // Future
  future: {
    compatibilityVersion: 4,
  },

  // Compatibility date https://nuxt.com/docs/api/configuration/nuxt-config#compatibilitydate
  compatibilityDate: '2024-12-13',

  // Nitro https://nuxt.com/docs/api/configuration/nuxt-config#nitro
  nitro: {
    imports: {
      imports: [
        { name: 'z', from: 'zod/v4' },

        // Server
        { name: '$t', from: resolve('./server/functions/$t.ts') },

        // Shared
        { name: 'generateUUID', from: resolve('./shared/functions/generate-uuid.ts') },
        { name: '$date', from: resolve('./server/functions/dayjs.ts') },
        { name: '$duration', from: resolve('./server/functions/dayjs.ts') },
        { name: '$log', from: resolve('./shared/functions/$log.ts') },
        { name: 'IItem', from: resolve('./shared/types/item.type.ts'), type: true },
        { name: 'ClassType', from: resolve('./client/types/class.type.ts'), type: true },
        { name: 'Datetime', from: resolve('./shared/types/datetime.type.ts'), type: true },
        { name: 'extendUtilitiesConfig', from: resolve('./config.ts') },
        { name: 'isDev', from: resolve('./shared/functions/is-dev.ts') },
      ],
    },

    alias: {
      $utils: join(process.cwd(), 'generated', 'utils.ts'),
      $utilsConfig: join(process.cwd(), 'generated', 'utilsConfig.ts'),
      $comparatorEnum: join(process.cwd(), 'generated', 'comparator-enum.ts'),
      $dataType: join(process.cwd(), 'generated', 'data-type.type.ts'),
    },
  },

  // Typescript https://nuxt.com/docs/api/configuration/nuxt-config#typescript
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          $utils: [join(process.cwd(), 'generated', 'utils.ts')],
          $utilsConfig: [join(process.cwd(), 'generated', 'utilsConfig.ts')],
          $comparatorEnum: [join(process.cwd(), 'generated', 'comparator-enum.ts')],
          $dataType: [join(process.cwd(), 'generated', 'data-type.type.ts')],
        },
      },
    },
  },

  // Dayjs
  dayjs: {
    defaultLocale: 'en-gb',
    locales: ['en-gb', 'sr', 'cs'],
    plugins: [
      'duration',
      'customParseFormat',
      'isBetween',
      'isSameOrAfter',
      'isSameOrBefore',
      'isoWeek',
      'dayOfYear',
      'utc',
      'timezone',
      'quarterOfYear',
    ],
  },

  i18n: {
    langDir: '../i18n',
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    locales: [
      {
        code: 'en-US',
        file: 'en-US_utilities.json',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        language: 'English',
        icon: 'i-emojione:flag-for-united-kingdom',
      },
      {
        code: 'cs-CZ',
        file: 'cs-CZ_utilities.json',
        dateFormat: 'DD.MM.YYYY',
        currency: 'CZK',
        language: 'Česky',
        icon: 'i-emojione:flag-for-czechia',
      },
    ],
  },
})
