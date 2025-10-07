/**
 * Represents a path to a nested property, either as a dot-separated string
 * or an array of string segments.
 *
 * Examples: 'a.b.c', ['a', 'b', 'c']
 */
type ObjectPath = string | number | readonly string[]

/**
 * Type guard to check if a value is a plain object (not null, array, etc.).
 * @param value The value to check.
 * @returns True if the value is a plain object, false otherwise.
 */
function isPlainObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Efficiently retrieves a nested property from an object using a string or array path.
 *
 * This function prioritizes performance by minimizing checks and avoiding
 * string splitting if an array path is provided. It handles `null` or `undefined`
 * intermediate properties gracefully by returning the default value.
 *
 * @template T The type of the object being queried.
 * @template K The expected type of the value at the specified path.
 * @param {T} obj The object to query.
 * @param {ObjectPath} path The dot-separated path string (e.g., 'user.name')
 *                           or an array of path segments (e.g., ['user', 'name']).
 * @param {K | undefined} [defaultValue] The value to return if the path is not found
 *                                       or an intermediate property is null/undefined.
 * @returns {K | undefined} The value at the specified path, or `defaultValue`
 *                          if the path doesn't exist or an intermediate is null/undefined.
 */
export function getFast<T extends object, K = any>(
  obj: T | null | undefined,
  path: ObjectPath,
  defaultValue?: K,
) {
  if (!isPlainObject(obj)) {
    return defaultValue
  }

  const pathParts = typeof path === 'string' ? path.split('.') : typeof path === 'number' ? [String(path)] : path
  let current: any = obj

  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i] as string

    // Check if the current value is an object (or array) and has the property.
    // We explicitly check for null/undefined to avoid errors on `current[part]`.
    if (
      current === null
      || typeof current !== 'object'
      || !Object.prototype.hasOwnProperty.call(current, part)
    ) {
      return defaultValue
    }
    current = current[part]
  }

  return current !== undefined ? (current as K) : defaultValue
}
