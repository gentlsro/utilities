import { createResolver } from 'nuxt/kit'
import { prepareLocalNuxtLayers } from './prepare-layers'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/scripts',
    '@nuxt/eslint',
  ],

  $meta: {
    name: 'utilities',
  },

  imports: {
    imports: [
      { name: 'z', from: 'zod' },
    ],
    dirs: [
      resolve('./app/constants'),
      resolve('./app/enums'),
      resolve('./app/functions'),
      resolve('./app/models'),
      resolve('./app/types'),

      // Shared
      resolve('./shared/regex'),
    ],
  },

  runtimeConfig: {
    public: {
      env: '',
      filesHost: '/api/files',
      transliterate: true,
      useUtc: false,
      domain: '',
    },
  },

  future: {
    compatibilityVersion: 5,
  },

  nitro: {
    imports: {
      dirsScanOptions: { fileFilter: () => false },

      imports: [
        // Types
        { name: 'Datetime', from: resolve('./shared/types/datetime'), type: true },
        { name: 'IItem', from: resolve('./shared/types/item'), type: true },
        { name: 'ObjectKey', from: resolve('./shared/types/object-key'), type: true },

        // Utils
        { name: 'z', from: 'zod' },
        { name: '$date', from: resolve('./shared/utils/$date') },
        { name: '$t', from: resolve('./shared/utils/$t') },
        { name: 'generateUUID', from: resolve('./shared/utils/generate-uuid') },
        { name: 'isDev', from: resolve('./shared/utils/is-dev') },

        // Lodash
        { name: 'get', from: 'lodash-es' },
        { name: 'set', from: 'lodash-es' },
        { name: 'isNil', from: 'lodash-es' },
        { name: 'pick', from: 'lodash-es' },
        { name: 'omit', from: 'lodash-es' },
        { name: 'isEmpty', from: 'lodash-es' },
        { name: 'isEqual', from: 'lodash-es' },
      ],
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  hooks: {
    ready: prepareLocalNuxtLayers,
  },

  i18n: {
    autoDeclare: false,
    langDir: '../i18n',
    defaultLocale: 'en-US',
    compilation: {
      strictMessage: false,
      escapeHtml: false,
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
