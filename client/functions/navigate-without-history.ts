/**
 * Navigates to the specified URL without adding it to the history stack
 */
export function navigateWithoutHistory(
  url: string,
  searchParams?: string,
) {
  const currentUrl = new URL(window.location.origin)
  currentUrl.pathname = url

  if (searchParams) {
    currentUrl.search = searchParams
  }

  window.history.pushState(history.state, '', currentUrl.toString())
}
