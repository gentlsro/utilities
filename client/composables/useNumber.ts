// Functions
import { useLocale } from './useLocale'
import { useNumber as useNumberShared } from '../../shared/composables/useNumber'

export function useNumber() {
  const { currentLocale } = useLocale()

  return useNumberShared('en-US')
}
