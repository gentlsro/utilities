import { NuxtModule, ModuleDependencyMeta } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface ModuleDependencies {
    ["vueuse"]?: ModuleDependencyMeta<typeof import("@vueuse/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/i18n"]?: ModuleDependencyMeta<typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/test-utils"]?: ModuleDependencyMeta<typeof import("@nuxt/test-utils/module").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/scripts"]?: ModuleDependencyMeta<typeof import("@nuxt/scripts").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/hints"]?: ModuleDependencyMeta<typeof import("@nuxt/hints").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/eslint"]?: ModuleDependencyMeta<typeof import("@nuxt/eslint").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
  }
  interface NuxtOptions {
    /**
     * Configuration for `@vueuse/nuxt`
     */
    ["vueuse"]: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     */
    ["i18n"]: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/test-utils/module`
     */
    ["testUtils"]: typeof import("@nuxt/test-utils/module").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/scripts`
     */
    ["scripts"]: typeof import("@nuxt/scripts").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/hints`
     */
    ["hints"]: typeof import("@nuxt/hints").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/eslint`
     */
    ["eslint"]: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@vueuse/nuxt`
     */
    ["vueuse"]?: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     */
    ["i18n"]?: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/test-utils/module`
     */
    ["testUtils"]?: typeof import("@nuxt/test-utils/module").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/scripts`
     */
    ["scripts"]?: typeof import("@nuxt/scripts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/hints`
     */
    ["hints"]?: typeof import("@nuxt/hints").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/eslint`
     */
    ["eslint"]?: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@vueuse/nuxt", Exclude<NuxtConfig["vueuse"], boolean>] | ["@nuxtjs/i18n", Exclude<NuxtConfig["i18n"], boolean>] | ["@nuxt/test-utils/module", Exclude<NuxtConfig["testUtils"], boolean>] | ["@nuxt/scripts", Exclude<NuxtConfig["scripts"], boolean>] | ["@nuxt/hints", Exclude<NuxtConfig["hints"], boolean>] | ["@nuxt/eslint", Exclude<NuxtConfig["eslint"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface ModuleDependencies {
    ["vueuse"]?: ModuleDependencyMeta<typeof import("@vueuse/nuxt").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxtjs/i18n"]?: ModuleDependencyMeta<typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/test-utils"]?: ModuleDependencyMeta<typeof import("@nuxt/test-utils/module").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/scripts"]?: ModuleDependencyMeta<typeof import("@nuxt/scripts").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/hints"]?: ModuleDependencyMeta<typeof import("@nuxt/hints").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/eslint"]?: ModuleDependencyMeta<typeof import("@nuxt/eslint").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/devtools"]?: ModuleDependencyMeta<typeof import("@nuxt/devtools").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
    ["@nuxt/telemetry"]?: ModuleDependencyMeta<typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, unknown>>
  }
  interface NuxtOptions {
    /**
     * Configuration for `@vueuse/nuxt`
     * @see https://www.npmjs.com/package/@vueuse/nuxt
     */
    ["vueuse"]: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     * @see https://www.npmjs.com/package/@nuxtjs/i18n
     */
    ["i18n"]: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/test-utils/module`
     * @see https://www.npmjs.com/package/@nuxt/test-utils/module
     */
    ["testUtils"]: typeof import("@nuxt/test-utils/module").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/scripts`
     * @see https://www.npmjs.com/package/@nuxt/scripts
     */
    ["scripts"]: typeof import("@nuxt/scripts").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/hints`
     * @see https://www.npmjs.com/package/@nuxt/hints
     */
    ["hints"]: typeof import("@nuxt/hints").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/eslint`
     * @see https://www.npmjs.com/package/@nuxt/eslint
     */
    ["eslint"]: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@vueuse/nuxt`
     * @see https://www.npmjs.com/package/@vueuse/nuxt
     */
    ["vueuse"]?: typeof import("@vueuse/nuxt").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/i18n`
     * @see https://www.npmjs.com/package/@nuxtjs/i18n
     */
    ["i18n"]?: typeof import("@nuxtjs/i18n").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/test-utils/module`
     * @see https://www.npmjs.com/package/@nuxt/test-utils/module
     */
    ["testUtils"]?: typeof import("@nuxt/test-utils/module").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/scripts`
     * @see https://www.npmjs.com/package/@nuxt/scripts
     */
    ["scripts"]?: typeof import("@nuxt/scripts").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/hints`
     * @see https://www.npmjs.com/package/@nuxt/hints
     */
    ["hints"]?: typeof import("@nuxt/hints").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/eslint`
     * @see https://www.npmjs.com/package/@nuxt/eslint
     */
    ["eslint"]?: typeof import("@nuxt/eslint").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/devtools`
     * @see https://www.npmjs.com/package/@nuxt/devtools
     */
    ["devtools"]?: typeof import("@nuxt/devtools").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O, unknown, boolean> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@vueuse/nuxt", Exclude<NuxtConfig["vueuse"], boolean>] | ["@nuxtjs/i18n", Exclude<NuxtConfig["i18n"], boolean>] | ["@nuxt/test-utils/module", Exclude<NuxtConfig["testUtils"], boolean>] | ["@nuxt/scripts", Exclude<NuxtConfig["scripts"], boolean>] | ["@nuxt/hints", Exclude<NuxtConfig["hints"], boolean>] | ["@nuxt/eslint", Exclude<NuxtConfig["eslint"], boolean>] | ["@nuxt/devtools", Exclude<NuxtConfig["devtools"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}