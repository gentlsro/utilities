import type { LocaleObject } from '@nuxtjs/i18n'
import utilsConfig from '$utilsConfig'

export function useLocale() {
  const localeCookie = useCookie('lang', { domain: utilsConfig.general.domain ?? undefined })
  const { locale, locales, defaultLocale, loadLocaleMessages } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const localesByCode = computed(() => {
    return (locales.value as LocaleObject[]).reduce<
      Record<string, LocaleObject>
    >((agg, locale) => {
      agg[locale.code] = locale

      return agg
    }, {})
  })

  const currentLocale = computed(() => {
    return localesByCode.value[locale.value]
      ?? locales.value.find(locale => locale.code === defaultLocale) as LocaleObject
  })

  const currentLocaleCode = computed(() => currentLocale.value.code)

  function getLocaleDateFormat(localeCode: string): string {
    return (localesByCode.value[localeCode] as any)?.dateFormat || 'YYYY-MM-DD'
  }

  function getCurrentLocaleDateFormat(): string {
    return getLocaleDateFormat(currentLocale.value.code)
  }

  // Communication across tabs
  const { data, post } = useBroadcastChannel<string, string>({ name: 'locale' })

  watch(locale, locale => {
    post(locale)
  })

  watch(data, locale => {
    const foundLocale = localesByCode.value[locale]

    if (!foundLocale) {
      return
    }

    handleSetLocale(foundLocale)
  })

  async function handleSetLocale(_locale: LocaleObject, callback?: () => void) {
    await loadLocaleMessages(_locale.code)

    const localePath = switchLocalePath(_locale.code)
    history.replaceState(null, '', localePath)
    locale.value = _locale.code
    localeCookie.value = _locale.code

    // useHead({ htmlAttrs: { lang: locale.code } })
    callback?.()
  }

  return {
    currentLocale,
    localesByCode,
    currentLocaleCode,
    handleSetLocale,
    getLocaleDateFormat,
    getCurrentLocaleDateFormat,
  }
}
