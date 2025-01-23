import utilsConfig from '../../.nuxt/generated/utils'

export function useTheme() {
  const prefersDark = usePreferredDark()
  const themeCookie = useCookie('theme', {
    default: getColor,
    domain: utilsConfig.general.domain,
  })

  const isDark = computed(() => {
    return themeCookie.value === 'dark'
  })

  // Utils
  function getColor() {
    return prefersDark.value ? 'dark' : 'light'
  }

  function toggleDark(val?: boolean) {
    let theme: 'dark' | 'light'

    if (val !== undefined) {
      theme = val ? 'dark' : 'light'
    } else {
      theme = themeCookie.value === 'dark' ? 'light' : 'dark'
    }

    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add(theme)
    }

    themeCookie.value = theme
  }

  // Communication across tabs
  const { data, post } = useBroadcastChannel<string, string>({ name: 'theme' })

  watch(themeCookie, themeCookie => {
    post(themeCookie)
  })

  watch(data, themeCookie => {
    toggleDark(themeCookie === 'dark')
  })

  return { color: themeCookie, isDark, toggleDark }
}
