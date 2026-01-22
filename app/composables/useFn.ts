import { utilsConfig } from '$utilsConfig'
import type { NonUndefined } from 'utility-types'

// Types
import type { UseFnPayload } from '../types/use-fn-payload.type'

type ISource = {
  type: 'component' | 'composable' | 'store'
  name: string
  id?: string
}

export type AsyncFunction<T> = (
  abortController: () => AbortController,
  source?: ISource,
) => Promise<T>

export type IUseFnOptions = {
  loadingInitialState?: boolean
  source?: ISource
}

const memoizedFns = new Map<string, Promise<any>>()

function mergeResponseWithOriginalObject<T>(payload: {
  merge: NonUndefined<UseFnPayload<T>['merge']>
  response: any
  result: T
}) {
  const { merge, response, result } = payload

  const newData = merge?.payloadKey ? get(result, merge.payloadKey) : result
  let newDataModified = result

  if (merge?.modifyResultFn) {
    newDataModified = merge?.modifyResultFn(response)
  }

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
  source?: ISource
  createAbortController: () => AbortController
}): Promise<T> {
  const { fnc, fnId, createAbortController, source } = payload

  // If no fnId is provided, execute directly without memoization
  if (!fnId) {
    return fnc(createAbortController, source)
  }

  // Check if we already have a memoized fn
  const existingFn = memoizedFns.get(fnId)
  if (existingFn) {
    return existingFn
  }

  // Create and store new memoized fn
  const newFn = fnc(createAbortController, source)
  memoizedFns.set(fnId, newFn)

  return newFn
}

export function useFn(options?: IUseFnOptions) {
  const { loadingInitialState } = options ?? {}

  // State
  const error = ref<any>()
  const isLoading = ref(loadingInitialState ?? false)
  const abortController = ref<AbortController>()
  const source = options?.source

  function createAbortController() {
    abortController.value = new AbortController()

    return abortController.value
  }

  async function handleFn<T = any>(
    fnc: AsyncFunction<T>,
    options?: UseFnPayload<T>,
  ): Promise<T> {
    console.log('👀 From utilities')

    const {
      fnId,
      merge,
      validation,
      modifyResultFn = utilsConfig.fn.modifyResultFn ?? ((response: any) => response),
      onComplete = utilsConfig.fn.onComplete,
      onError = utilsConfig.fn.onError,
    } = options ?? {}

    let response: any
    let result: any

    try {
      // Initialize
      error.value = undefined
      response = undefined
      result = undefined

      // Validate
      if (validation) {
        const { isValid, errors } = validation.validate()

        if (!isValid) {
          console.log('💀', errors)

          throw new Error($t('general.errorOccured'))
        }
      }

      isLoading.value = true

      // Handle memoized fns
      response = await executeFn({ fnc, fnId, createAbortController, source })
      result = modifyResultFn(response)

      // When `merge` is used, we merge the response with the original object
      if (merge) {
        mergeResponseWithOriginalObject({ merge, response, result })
      }

      validation?.reset()

      return result as T
    } catch (_error: any) {
      error.value = _error

      return new Promise((_resolve, reject) => reject(error))
    } finally {
      isLoading.value = false

      if (error.value && onError) {
        await onError({ error: error.value, response, fnPayload: options ?? {} })
      } else if (onComplete) {
        onComplete({ response, result, fnPayload: options ?? {} })
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
