import { createResolver } from 'nuxt/kit'

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
      { name: 'ClassType', from: resolve('./app/types/class.type.ts'), type: true },
    ],

    dirs: [
      resolve('./app/models'),
      resolve('./shared/models'),
      resolve('./shared/enums'),
      resolve('./shared/regex'),
      resolve('./shared/constants'),
      resolve('./shared/functions'),
    ],
  },

  runtimeConfig: {
    public: {
      env: '',
      filesHost: '/api/files',
    },
  },

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
      ],
      dirs: [
        resolve('./shared/regex'),
        resolve('./shared/enums'),
        resolve('./shared/functions'),
        // resolve('./shared/constants'),
        // resolve('./shared/models'),
        // resolve('./shared/composables'),
      ],
    },

  },

  i18n: {
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
