// Types
import type { IDurationOptions } from '../../shared/composables/useDuration'

// Functions
import { useDuration as useDurationShared } from '../../shared/composables/useDuration'

export function useDuration() {
  const { currentLocale } = useLocale()

  const {
    formatDuration: formatDurationShared,
    ...other
  } = useDurationShared({ localeIso: currentLocale.value.code })

  function formatDuration(
    valueRef?: MaybeRefOrGetter<number | string | null>,
    options: IDurationOptions = {},
  ) {
    const value = toValue(valueRef)

    return formatDurationShared(value, options)
  }

  return {
    ...other,
    formatDuration,
  }
}
