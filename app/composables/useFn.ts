import { utilsConfig } from '$utilsConfig'
import type { NonUndefined } from 'utility-types'

// Types
import type { UseFnPayload } from '../types/use-fn-payload.type'

const memoizedFns = new Map<string, Promise<any>>()

export type AsyncFunction<T> = (abortController: () => AbortController) => Promise<T>

function mergeResponseWithOriginalObject<T>(payload: {
  merge: NonUndefined<UseFnPayload<T>['merge']>
  result: T
}) {
  const { merge, result } = payload

  const newData = merge?.payloadKey ? get(result, merge.payloadKey) : result
  const modifyFnc = merge?.modifyResultFn ?? utilsConfig.fn?.modifyResultFn ?? ((obj: any) => obj)
  const newDataModified = modifyFnc(newData)

  if (newData) {
    // When `merge.override` is true, we sync the original object with the new data
    // essentially replacing the original object
    if (merge?.override) {
      merge.originalObj.syncToParent?.(newDataModified)
    }

    // Otherwise, we merge the new data with the original object
    else {
      const originalObj = toValue(merge.originalObj)
      const resultObj = Object.assign(originalObj, newDataModified)

      merge.originalObj.syncToParent?.(resultObj)
    }
  }
}

/**
 * Executes a fn with optional memoization
 */
async function executeFn<T>(payload: {
  fnc: AsyncFunction<T>
  fnId?: string
  createAbortController?: () => AbortController
}): Promise<T> {
  const { fnc, fnId, createAbortController } = payload

  // If no fnId is provided, execute directly without memoization
  if (!fnId) {
    return fnc(createAbortController!)
  }

  // Check if we already have a memoized fn
  const existingFn = memoizedFns.get(fnId)
  if (existingFn) {
    return existingFn
  }

  // Create and store new memoized fn
  const newFn = fnc(createAbortController!)
  memoizedFns.set(fnId, newFn)

  return newFn
}

export function useFn(options?: { loadingInitialState?: boolean }) {
  const { loadingInitialState } = options ?? {}

  // State
  const error = ref<any>()
  const isLoading = ref(loadingInitialState ?? false)
  const abortController = ref<AbortController>()

  function createAbortController() {
    abortController.value = new AbortController()

    return abortController.value
  }

  async function handleFn<T = any>(
    fnc: AsyncFunction<T>,
    options?: UseFnPayload<T>,
  ): Promise<T> {
    const {
      fnId,
      merge,
      validation,
      onComplete,
    } = options ?? {}

    let response: any
    let result: any

    try {
      // Initialize
      error.value = undefined
      response = undefined
      result = undefined

      const payloadKey = options?.payloadKey
        ? options.payloadKey
        : isNull(options?.payloadKey) ? undefined : utilsConfig.fn?.payloadKey

      // Validate
      if (validation) {
        const { isValid, errors } = validation.validate()

        if (!isValid) {
          console.log('💀', errors)

          throw new Error($t('general.invalidForm'))
        }
      }

      isLoading.value = true

      // Handle memoized fns
      response = await executeFn({ fnc, fnId, createAbortController })
      result = payloadKey ? get(response, payloadKey) : response

      // When `merge` is used, we merge the response with the original object
      if (merge) {
        mergeResponseWithOriginalObject({ merge, result })
      }

      validation?.reset()

      return result as T
    } catch (_error: any) {
      error.value = _error

      return new Promise((_resolve, reject) => reject(error))
    } finally {
      isLoading.value = false

      if (error && options?.onError) {
        await options.onError({ error: error.value, response })
      } else if (onComplete) {
        onComplete({ response, result })
      }

      if (fnId) {
        memoizedFns.delete(fnId)
      }

      isLoading.value = false
    }
  }

  return {
    isLoading,
    abortController,
    fn: handleFn,
  }
}
