// Functions
import { useLocale } from './useLocale'
import { useDuration as useDurationShared } from '../../shared/composables/useDuration'

export function useDuration() {
  const { currentLocale } = useLocale()

  return useDurationShared({ localeIso: currentLocale.value.code })
}
