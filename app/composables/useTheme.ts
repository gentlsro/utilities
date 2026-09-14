function useThemeState() {
  const prefersDark = usePreferredDark()
  const themeCookie = useCookie<'dark' | 'light' | undefined>('theme', {
    domain: usePreferenceCookieDomain(),
  })
  const color = computed(() => themeCookie.value ?? getPreferredColor())

  const isDark = computed(() => {
    return color.value === 'dark'
  })

  // Utils
  function getPreferredColor(): 'dark' | 'light' {
    return prefersDark.value ? 'dark' : 'light'
  }

  function applyColor(theme: 'dark' | 'light') {
    if (!import.meta.client) {
      return
    }

    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }

  function toggleDark(val?: boolean) {
    const theme = val === undefined
      ? color.value === 'dark' ? 'light' : 'dark'
      : val ? 'dark' : 'light'

    themeCookie.value = theme
  }

  function reset() {
    themeCookie.value = getPreferredColor()
  }

  // Communication across tabs
  const { data, post } = useBroadcastChannel<string, string>({ name: 'theme' })

  watch(themeCookie, theme => {
    if (theme) {
      applyColor(theme)
      post(theme)
    }
  }, { flush: 'sync' })

  watch(data, theme => {
    if (theme === themeCookie.value) {
      return
    }

    toggleDark(theme === 'dark')
  })

  onMounted(() => {
    if (!themeCookie.value) {
      themeCookie.value = getPreferredColor()
    } else {
      applyColor(themeCookie.value)
    }
  })

  return { color, isDark, toggleDark, reset }
}

export const useTheme = createSharedComposable(useThemeState)
