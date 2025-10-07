/**
 * Represents a path to a nested property, either as a dot-separated string
 * or an array of string segments.
 *
 * Examples: 'a.b.c', ['a', 'b', 'c']
 */
type ObjectPath = string | readonly string[]

/**
 * Type guard to check if a value is a plain object (not null, array, etc.).
 * @param value The value to check.
 * @returns True if the value is a plain object, false otherwise.
 */
function isPlainObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Efficiently sets a nested property on an object, creating intermediate paths if necessary.
 * This function mutates the original object.
 *
 * This function prioritizes performance by minimizing checks and avoiding
 * string splitting if an array path is provided. It automatically creates
 * plain objects for missing intermediate paths.
 *
 * @template T The type of the object being modified.
 * @template V The type of the value to set.
 * @param {T} obj The object to modify.
 * @param {ObjectPath} path The dot-separated path string (e.g., 'user.name')
 *                           or an array of path segments (e.g., ['user', 'name']).
 * @param {V} value The value to set at the specified path.
 * @returns {T} The modified object (same reference as input `obj`).
 * @throws {Error} If the initial `obj` is null, undefined, or not an object.
 */
export function setFast<T extends object, V = any>(
  obj: T | null | undefined,
  path: ObjectPath,
  value: V,
): T {
  if (!isPlainObject(obj)) {
    throw new Error('Cannot set property on null, undefined, or non-object.')
  }

  const pathParts = typeof path === 'string' ? path.split('.') : path
  let current: any = obj // Use 'any' for `current` to allow dynamic property access

  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i] as string

    // If the current part is not an object or is null/undefined, create a new plain object.
    if (!isPlainObject(current[part])) {
      current[part] = {}
    }
    current = current[part]
  }

  // Set the final property
  current[pathParts[pathParts.length - 1] as string] = value

  return obj
}
