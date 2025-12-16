import { createResolver } from '@nuxt/kit'
import { join } from 'pathe'

const { resolve } = createResolver(import.meta.url)
const isMonorepo = import.meta.env.VITE_MONOREPO === 'true'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [],

  // Modules https://nuxt.com/docs/api/configuration/nuxt-config#modules
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    'dayjs-nuxt',
  ],

  // Layer meta
  $meta: {
    name: 'utilities',
  },

  // SSR https://nuxt.com/docs/api/configuration/nuxt-config#ssr
  // ssr: false,

  // Imports https://nuxt.com/docs/api/configuration/nuxt-config#imports
  imports: {
    imports: [
      { name: 'z', from: 'zod/v4' },

      // Client
      { name: 'getComponentName', from: resolve('./app/functions/get-component-name.ts') },
      { name: '$t', from: resolve('./app/functions/$t.ts') },
      { name: '$p', from: resolve('./app/functions/$p.ts') },
      { name: '$nav', from: resolve('./app/functions/$nav.ts') },
      { name: 'injectStrict', from: resolve('./app/functions/inject-strict.ts') },
      { name: 'initRef', from: resolve('./app/functions/init-ref.ts') },

      // Shared
      { name: 'generateUUID', from: resolve('./shared/functions/generate-uuid.ts') },
      { name: '$date', from: resolve('./app/functions/dayjs.ts') },
      { name: '$duration', from: resolve('./app/functions/dayjs.ts') },
      { name: '$log', from: resolve('./shared/functions/$log.ts') },
      { name: 'IItem', from: resolve('./shared/types/item.type.ts'), type: true },
      { name: 'ClassType', from: resolve('./app/types/class.type.ts'), type: true },
      { name: 'Datetime', from: resolve('./shared/types/datetime.type.ts'), type: true },
      { name: 'isDev', from: resolve('./shared/functions/is-dev.ts') },
      { name: 'resolveComponentByName', from: resolve('./app/functions/resolve-component-by-name.ts') },

      // Config
      { name: 'extendUtilitiesConfig', from: resolve('./config.ts') },
    ],
  },

  // Devtools https://nuxt.com/docs/api/configuration/nuxt-config#devtools
  devtools: {
    enabled: isMonorepo,
  },

  // Alias
  alias: {
    $utils: join(process.cwd(), 'generated', 'utils.ts'),
    $utilsConfig: join(process.cwd(), 'generated', 'utilsConfig.ts'),
    $comparatorEnum: join(process.cwd(), 'generated', 'comparator-enum.ts'),
    $dataType: join(process.cwd(), 'generated', 'data-type.type.ts'),
    $components: join(process.cwd(), 'generated', 'components-by-name.ts'),
  },

  // Nitro https://nuxt.com/docs/api/configuration/nuxt-config#nitro
  nitro: {
    imports: {
      imports: [
        { name: 'z', from: 'zod/v4' },

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
        { name: 'ClassType', from: resolve('./app/types/class.type.ts'), type: true },
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
