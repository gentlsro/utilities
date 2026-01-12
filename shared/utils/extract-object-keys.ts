/**
 * Extracts all "leaf" keys present in an object
 *
 * Will traverse the object and return all "leaf" keys present in the sturcture
 * "Leaf" keys are the keys that hold a primitive value
 *
 * For example, for the following object:
 * @example
 * {
 *   "str": "foo",
 *   "num": 123,
 *   "obj": { "nestedKey": "Test" },
 *   "arr": [
 *     { "name": "John", "roles": ["Something else"] },
 *     { "name": "Jane", "roles": ["Member"] },
 *     { "name": "Thomas", "roles": ["Admin"] }
 *   ]
 * }
 *
 * For the above object, the function will return:
 * @example
 * [
 *   "str",
 *   "num",
 *   "obj.nestedKey",
 *   "arr.[n].name",
 *   "arr.[n].roles.[n]"
 * ]
 */
export function extractObjectKeys(
  obj: unknown,
  options: {
    prefix?: string

    /**
     * When true, the process will also keep the "object" keys
     *
     * For example, for the following object:
     * @example
     * {
     *   "str": "foo",
     *   "num": 123,
     *   "obj": { "nestedKey": "Test" },
     * }
     *
     * Would return:
     * @example
     * [
     *   "str",
     *   "num",
     *   "obj", // <- This is the object key that wouldn't be normally returned
     *   "obj.nestedKey",
     * ]
     */
    keepObjectKeys?: boolean

    /**
     * When provided, the process will omit the keys that are present in the array
     *
     * For example, if the omitKeys is ["obj.nestedKey"], the function will return:
     * @example
     * [
     *   "str",
     *   "num",
     * ]
     */
    omitKeys?: string[]
  } = {},
): string[] {
  const { prefix = '', keepObjectKeys = false, omitKeys = [] } = options

  if (Array.isArray(obj)) {
    // Only process the first item, if present
    return obj.length > 0
      ? extractObjectKeys(
          obj[0],
          { prefix: prefix ? `${prefix}.[n]` : '[n]', keepObjectKeys, omitKeys },
        )
      : []
  }

  if (obj && typeof obj === 'object') {
    const results: string[] = []

    // If keepObjectKeys is true, add the current object key to results
    if (keepObjectKeys && prefix) {
      const isOmitted = omitKeys.some(key => prefix.endsWith(key))

      if (!isOmitted) {
        results.push(prefix)
      }
    }

    // Process nested keys
    const nestedKeys = Object.entries(obj as IItem).flatMap(
      ([key, value]) => {
        return extractObjectKeys(
          value,
          { prefix: prefix ? `${prefix}.${key}` : key, keepObjectKeys, omitKeys },
        )
      },
    )
    return results.concat(nestedKeys)
  }

  // Primitive value
  const isOmitted = omitKeys.some(key => prefix.endsWith(key))

  return prefix && !isOmitted ? [prefix] : []
}
