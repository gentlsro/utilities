export function isDev() {
  if (import.meta.dev) {
    return true
  }

  const rC = useRuntimeConfig()
  const env = rC.public.env

  if (env === 'local') {
    return true
  } else if (env === 'development') {
    return true
  }

  return false
}
