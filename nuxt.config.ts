import { createResolver } from '@nuxt/kit'
import { join } from 'node:path'

const { resolve } = createResolver(import.meta.url)
const isMonorepo = import.meta.env.VITE_MONOREPO === 'true'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [],

  // Modules https://nuxt.com/docs/api/configuration/nuxt-config#modules
  modules: [
    resolve('./modules/utilities.module'),
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    'nuxt-lodash',
    'dayjs-nuxt',
  ],

  // SSR https://nuxt.com/docs/api/configuration/nuxt-config#ssr
  // ssr: false,

  // Imports https://nuxt.com/docs/api/configuration/nuxt-config#imports
  imports: {
    imports: [
      { name: 'z', from: 'zod' },

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
      { name: 'resolveComponentByName', from: './client/functions/resolve-component-by-name.ts' },
    ],
  },

  // Devtools https://nuxt.com/docs/api/configuration/nuxt-config#devtools
  devtools: {
    enabled: isMonorepo,
  },

  // Runtime config https://nuxt.com/docs/api/configuration/nuxt-config#runtimeconfig
  runtimeConfig: {
    public: {
      COOKIE_DOMAIN: undefined as string | undefined,
      FILES_HOST: undefined as string | undefined,
    },
  },

  // Src dir https://nuxt.com/docs/api/configuration/nuxt-config#srcdir
  srcDir: 'client/',

  // Alias
  alias: {
    $utils: './generated/utils.ts',
    $utilsConfig: './generated/utilsConfig.ts',
    $utilsLayer: resolve('.'),
    $comparatorEnum: './generated/comparator-enum.ts',
    $dataType: './generated/data-type.type.ts',
    $components: './generated/components-by-name.ts',
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
        { name: 'z', from: 'zod' },

        // Lodash
        { name: 'get', from: 'lodash-es' },
        { name: 'set', from: 'lodash-es' },
        { name: 'isNil', from: 'lodash-es' },
        { name: 'pick', from: 'lodash-es' },
        { name: 'omit', from: 'lodash-es' },
        { name: 'isEmpty', from: 'lodash-es' },
        { name: 'isEqual', from: 'lodash-es' },

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
      $utils: join(process.cwd(), '.nuxt', 'generated', 'utils.ts'),
      $utilsConfig: join(process.cwd(), '.nuxt', 'generated', 'utilsConfig.ts'),
      $comparatorEnum: join(process.cwd(), '.nuxt', 'generated', 'comparator-enum.ts'),
      $dataType: join(process.cwd(), '.nuxt', 'generated', 'data-type.type.ts'),
    },
  },

  // Typescript https://nuxt.com/docs/api/configuration/nuxt-config#typescript
  typescript: {},

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

  // Lodash
  lodash: { prefix: '' },
})
