import { addImports, createResolver, defineNuxtModule } from 'nuxt/kit'
import * as lodash from 'lodash-es'

const EXCLUDED_KEYS = [
  'wrapperValue',
  'wrapperToIterator',
  'wrapperReverse',
  'wrapperPlant',
  'wrapperNext',
  'wrapperLodash',
  'wrapperCommit',
  'wrapperChain',
  'wrapperAt',
  'templateSettings',
  'toIterator',
  'VERSION',
  'lodash',
  'value',
  'valueOf',
  'toJSON',
  'thru',
  'plant',
  'next',
  'default',
  'commit',
  'head',
]

export default defineNuxtModule({
  setup: () => {
    console.log('✔ Lodash module setup')
    for (const name of Object.keys(lodash)) {
      if (EXCLUDED_KEYS.includes(name)) {
        continue
      }

      addImports({ name, as: name, from: 'lodash-es' })
    }
  },
})
