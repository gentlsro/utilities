
// @ts-nocheck
import locale_en_45US_utilities_46json_096b2115 from "#nuxt-i18n/096b2115";
import locale_cs_45CZ_utilities_46json_966973a8 from "#nuxt-i18n/966973a8";

export const localeCodes =  [
  "en-US",
  "cs-CZ"
]

export const localeLoaders = {
  "en-US": [
    {
      key: "locale_en_45US_utilities_46json_096b2115",
      load: () => Promise.resolve(locale_en_45US_utilities_46json_096b2115),
      cache: true
    }
  ],
  "cs-CZ": [
    {
      key: "locale_cs_45CZ_utilities_46json_966973a8",
      load: () => Promise.resolve(locale_cs_45CZ_utilities_46json_966973a8),
      cache: true
    }
  ]
}

export const vueI18nConfigs = []

export const nuxtI18nOptions = {
  restructureDir: "i18n",
  experimental: {
    localeDetector: "",
    switchLocalePathLinkSSR: false,
    autoImportTranslationFunctions: false,
    typedPages: true,
    typedOptionsAndMessages: false,
    generatedLocaleFilePathFormat: "absolute",
    alternateLinkCanonicalQueries: false,
    hmr: true
  },
  bundle: {
    compositionOnly: true,
    runtimeOnly: false,
    fullInstall: true,
    dropMessageCompiler: false,
    optimizeTranslationDirective: true
  },
  compilation: {
    strictMessage: false,
    escapeHtml: true
  },
  customBlocks: {
    defaultSFCLang: "json",
    globalSFCScope: false
  },
  locales: [
    {
      code: "en-US",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
      language: "English",
      icon: "i-emojione:flag-for-united-kingdom",
      files: [
        {
          path: "/home/jk/Projects/oma/app-Root/libs/Utilities/i18n/en-US_utilities.json",
          cache: undefined
        }
      ]
    },
    {
      code: "cs-CZ",
      dateFormat: "DD.MM.YYYY",
      currency: "CZK",
      language: "Česky",
      icon: "i-emojione:flag-for-czechia",
      files: [
        {
          path: "/home/jk/Projects/oma/app-Root/libs/Utilities/i18n/cs-CZ_utilities.json",
          cache: undefined
        }
      ]
    }
  ],
  defaultLocale: "",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  trailingSlash: false,
  defaultLocaleRouteNameSuffix: "default",
  strategy: "prefix_except_default",
  lazy: false,
  langDir: "../i18n",
  rootRedirect: undefined,
  detectBrowserLanguage: {
    alwaysRedirect: false,
    cookieCrossOrigin: false,
    cookieDomain: null,
    cookieKey: "i18n_redirected",
    cookieSecure: false,
    fallbackLocale: "",
    redirectOn: "root",
    useCookie: true
  },
  differentDomains: false,
  baseUrl: "",
  customRoutes: "page",
  pages: {},
  skipSettingLocaleOnNavigate: false,
  types: "composition",
  debug: false,
  parallelPlugin: false,
  multiDomainLocales: false,
  i18nModules: []
}

export const normalizedLocales = [
  {
    code: "en-US",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    language: "English",
    icon: "i-emojione:flag-for-united-kingdom",
    files: [
      {
        path: "/home/jk/Projects/oma/app-Root/libs/Utilities/i18n/en-US_utilities.json",
        cache: undefined
      }
    ]
  },
  {
    code: "cs-CZ",
    dateFormat: "DD.MM.YYYY",
    currency: "CZK",
    language: "Česky",
    icon: "i-emojione:flag-for-czechia",
    files: [
      {
        path: "/home/jk/Projects/oma/app-Root/libs/Utilities/i18n/cs-CZ_utilities.json",
        cache: undefined
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false
export const hasPages = false

export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18nInternal"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
/** client **/

/** client-end **/