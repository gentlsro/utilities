import { merge } from 'lodash-es'

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function applyExplicitUndefined(target: PlainObject, patch: PlainObject) {
  for (const key in patch) {
    if (!Object.prototype.hasOwnProperty.call(patch, key)) {
      continue
    }

    const patchValue = patch[key]
    const targetValue = target[key]

    if (patchValue === undefined) {
      target[key] = undefined
    } else if (isPlainObject(patchValue) && isPlainObject(targetValue)) {
      applyExplicitUndefined(targetValue, patchValue)
    }
  }
}

/**
 * Deep merge `patch` into `target`, but keep explicit `undefined` values from `patch`.
 * Mutates and returns `target`.
 */
export function mergeFast<T extends object, U extends object>(target: T, patch: U): T & U {
  merge(target, patch)
  applyExplicitUndefined(target as PlainObject, patch as PlainObject)

  return target as T & U
}
