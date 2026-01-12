/* eslint-disable ts/consistent-type-definitions */

interface ImportMetaEnv {
  readonly VITE_MONOREPO: string
  readonly VITE_INSTALL_LAYER_DEPS: string
  readonly NUXT_PUBLIC_ENV: string
  readonly NUXT_PUBLIC_FILES_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
