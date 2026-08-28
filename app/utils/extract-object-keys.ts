// Types
import type { IItem } from '../../shared/types/item.type'

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
     * Maximum object depth to inspect. Runtime objects can contain framework-owned
     * graphs that are much deeper than useful data-field paths.
     *
     * @default 20
     */
    maxDepth?: number

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
  const { prefix = '', keepObjectKeys = false, maxDepth = 20, omitKeys = [] } = options

  return extractKeys(obj, prefix, new WeakSet<object>(), 0)

  function extractKeys(
    value: unknown,
    currentPrefix: string,
    ancestors: WeakSet<object>,
    depth: number,
  ): string[] {
    if (depth > maxDepth) {
      return []
    }

    if (currentPrefix && omitKeys.some(key => currentPrefix.endsWith(key))) {
      return []
    }

    if (value && typeof value === 'object') {
      if (ancestors.has(value)) {
        return []
      }

      ancestors.add(value)
    }

    if (Array.isArray(value)) {
      // Only process the first item, if present
      const result = value.length > 0
        ? extractKeys(
            value[0],
            currentPrefix ? `${currentPrefix}.[n]` : '[n]',
            ancestors,
            depth + 1,
          )
        : []

      ancestors.delete(value)

      return result
    }

    if (value && typeof value === 'object') {
      const results: string[] = []

      // If keepObjectKeys is true, add the current object key to results
      if (keepObjectKeys && currentPrefix) {
        results.push(currentPrefix)
      }

      // Process nested keys
      const nestedKeys = Object.entries(value as IItem).flatMap(([key, nestedValue]) => {
        return extractKeys(
          nestedValue,
          currentPrefix ? `${currentPrefix}.${key}` : key,
          ancestors,
          depth + 1,
        )
      })
      ancestors.delete(value)

      return results.concat(nestedKeys)
    }

    // Primitive value
    return currentPrefix ? [currentPrefix] : []
  }
}
