import type { Required } from 'utility-types'
import type { FuseOptions } from '@vueuse/integrations/useFuse.mjs'

export type IFuseOptions<T = any> = Required<FuseOptions<T>, 'keys'>
