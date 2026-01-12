// Types
import type { IUtilitiesConfig } from '../../config'

export function extendUtilitiesConfig<T extends Partial<IUtilitiesConfig> & IItem>(config: T): T {
  return config
}
