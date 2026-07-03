import { mergeWith } from 'lodash-es'
import type { merge } from 'lodash-es'

type PlainObject = Record<string, unknown>

function arrayReplaceCustomizer(_objValue: unknown, srcValue: unknown): unknown {
  if (Array.isArray(srcValue)) {
    return srcValue
  }
}

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
 * Deep merge one or more sources into `target`, but keep explicit `undefined` values from
 * each plain-object source.
 * Mutates and returns `target`.
 */
function mergeFastBase(...args: Parameters<typeof merge>): ReturnType<typeof merge> {
  const [target, ...patches] = args

  const result = patches.length === 0
    ? target
    : mergeWith(target, ...patches, arrayReplaceCustomizer)

  if (!isPlainObject(target)) {
    return result
  }

  for (const patch of patches) {
    if (isPlainObject(patch)) {
      applyExplicitUndefined(target, patch)
    }
  }

  return result
}

export const mergeFast = mergeFastBase as typeof merge
