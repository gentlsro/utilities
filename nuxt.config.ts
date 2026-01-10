import { createResolver } from '@nuxt/kit'
import { join } from 'pathe'

const { resolve } = createResolver(import.meta.url)
const isMonorepo = import.meta.env.VITE_MONOREPO === 'true'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Imports https://nuxt.com/docs/api/configuration/nuxt-config#imports
  imports: {
    imports: [
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

  // Nitro https://nuxt.com/docs/api/configuration/nuxt-config#nitro
  nitro: {
    imports: {
      imports: [
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

        // Config
        { name: 'extendUtilitiesConfig', from: resolve('./config.ts') },
      ],
    },
  },
})
