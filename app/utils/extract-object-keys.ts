/**
 * Extracts all "leaf" keys present in an object
 *
 * Will traverse the object and return all "leaf" keys present in the structure
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
     * Optional traversal limit; the root is depth 0 and each property or array
     * element adds one level. Deeper paths are omitted. Unlimited by default
     * so callers inspecting data do not silently lose deeply nested fields.
     */
    maxDepth?: number

    /**
     * Omits paths ending with one of these keys. Descendants are still inspected;
     * omitting an object path does not omit its entire subtree.
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
  const { prefix = '', keepObjectKeys = false, maxDepth = Number.POSITIVE_INFINITY, omitKeys = [] } = options
  if (maxDepth !== Number.POSITIVE_INFINITY && (!Number.isInteger(maxDepth) || maxDepth < 0)) {
    throw new RangeError('maxDepth must be a non-negative integer or Infinity')
  }

  type Frame = { value: unknown, prefix: string, depth: number, leaving?: boolean }
  const stack: Frame[] = [{ value: obj, prefix, depth: 0 }]
  const ancestors = new WeakSet<object>()
  const results: string[] = []

  // Explicit entry/exit frames avoid call-stack overflow while tracking only
  // ancestors, so a shared object still contributes paths under every parent.
  while (stack.length) {
    const { value, prefix: currentPrefix, depth, leaving } = stack.pop()!
    if (leaving) {
      ancestors.delete(value as object)
      continue
    }
    if (depth > maxDepth) {
      continue
    }

    if (value && typeof value === 'object') {
      if (ancestors.has(value)) {
        continue
      }
      ancestors.add(value)
      stack.push({ value, prefix: currentPrefix, depth, leaving: true })

      if (Array.isArray(value)) {
        // Arrays retain their existing first-item sampling and [n] notation.
        if (value.length && depth < maxDepth) {
          stack.push({ value: value[0], prefix: currentPrefix ? `${currentPrefix}.[n]` : '[n]', depth: depth + 1 })
        }
        continue
      }

      if (keepObjectKeys && currentPrefix && !omitKeys.some(key => currentPrefix.endsWith(key))) {
        results.push(currentPrefix)
      }
      if (depth === maxDepth) {
        continue
      }
      const entries = Object.entries(value)
      // Reverse the stack insertion to retain Object.entries traversal order.
      for (let index = entries.length - 1; index >= 0; index--) {
        const [key, nestedValue] = entries[index]!
        stack.push({ value: nestedValue, prefix: currentPrefix ? `${currentPrefix}.${key}` : key, depth: depth + 1 })
      }
    } else if (currentPrefix && !omitKeys.some(key => currentPrefix.endsWith(key))) {
      results.push(currentPrefix)
    }
  }

  return results
}
