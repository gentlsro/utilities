// Functions
import { useLocale } from './useLocale'
import { useDateUtils as useDateUtilsShared } from '../../shared/composables/useDateUtils'

export function useDateUtils() {
  const { currentLocale } = useLocale()

  return useDateUtilsShared(currentLocale.value.code)
}
