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
  },

  runtimeConfig: {
    public: {
      env: '',
      filesHost: '/api/files',
      transliterate: '',
      useUtc: '',
      domain: '',
    },
  },

  future: {
    compatibilityVersion: 5,
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
    },

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
