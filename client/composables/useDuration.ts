// Functions
import { useLocale } from './useLocale'
import { useDuration as useDurationShared } from '../../shared/composables/useDuration'

export function useDuration() {
  const { currentLocale } = useLocale()

  return useDurationShared(currentLocale.value.code)
}
