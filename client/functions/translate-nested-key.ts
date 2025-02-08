import type { TranslateOptions } from '#i18n'

/**
 * Will try to resolve the `.self` key (by default)
 *
 * Example:
 * We have the following i18n structure: { status: { self: "Status | Statuses", ... }}
 * We get the key `status` from somewhere (probably BE)
 * The function will then return `Status | Statuses` because it tries to first get the `.self` key under the given key
 */
export function translateNestedKey(
  key: string,
  options?: {
    nestedKey?: string
    plural?: number | string
    translateOptions?: TranslateOptions
    /**
     * NOTE: Use case
     * Let's have the following i18n structure: { xxx: { a: "asdf", b: "qwer", c: { d: "zxcv" }}}
     * We get a key "d" from somewhere (probably BE), but we are not use if it's in the first level
     * of the i18n object or the second one or some other level. We can use an array of prefixes
     * to check for these keys in the structure.
     * So, `key = 'd', prefix = ['xxx', 'xxx.c'] would first try to resolve the `xxx.d` key and if
     * it's not found, it would try to resolve it on the `xxx.c.d` key.
     */
    prefix?: string[]
  },
) {
  const { $i18n } = tryUseNuxtApp() ?? {}
  const { t = (...args: any[]) => args[0] } = $i18n ?? {}

  const {
    nestedKey = 'self',
    plural = 1,
    translateOptions,
    prefix,
  } = options ?? {}
  const translated = t(key, +plural, translateOptions)
  const isSame = key === translated

  if (!isSame) {
    return translated
  }

  if (prefix) {
    const prefixes = Array.isArray(prefix) ? prefix : [prefix]

    for (const prefix of prefixes) {
      let prefixedKey = `${prefix}.${key}`
      const translated = t(prefixedKey, +plural, translateOptions)

      if (prefixedKey !== translated) {
        return translated
      }

      prefixedKey = `${prefix}.${key}.${nestedKey}`
      const translatedNested = t(prefixedKey, +plural, translateOptions)

      if (prefixedKey !== translatedNested) {
        return translatedNested
      }
    }
  } else {
    const translatedNested = t(`${key}.${nestedKey}`, +plural, translateOptions)
    const isSameNested = key === translatedNested

    if (!isSameNested) {
      return translatedNested
    }
  }

  return translated
}
