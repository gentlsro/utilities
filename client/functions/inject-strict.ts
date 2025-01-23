export function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback)

  if (isUndefined(resolved)) {
    throw new Error(`Could not resolve ${key.description}`)
  }

  return resolved
}
