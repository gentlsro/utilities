// @unocss-include
import { get, uniq } from 'lodash-es'
import { utilsConfig } from '$utilsConfig'

// Types
import type { IZodValidationOutput } from '../types/zod'

type AsyncFunction<T> = (abortController: () => AbortController) => Promise<T>

class CustomError extends Error {
  constructor(public errors: any[], public warnings?: any[], message?: string) {
    super(message)
  }
}

type UseRequestOptions = {
  payloadKey?: string
  $z?: IZodValidationOutput<any>

  /**
   * When true, the `payloadKey` will be ignored -> the actual result will be
   * returned instead of the resolved payload
   */
  noResolve?: boolean

  /**
   * We can merge the response with the original object
   */
  merge?: {
    /**
     * The key for the payload object
     */
    payloadKey?: string

    /**
     * The original object
     */
    originalObj: MaybeRefOrGetter<any>

    /**
     * Override the original object with the modified object
     */
    override?: boolean

    /**
     * The function to modify the response object
     */
    modifyFnc?: (obj: any) => any
  }

  // Operation logging
  logging?: {
    /**
     * The operation name -> used in operation log table to identify the operation
     */
    operationName?: string

    /**
     * The entity name -> to eventually link the operation to some entity page (like user, product, etc.)
     */
    entityName?: string

    /**
     * The entity key -> some entities may have other unique identifiers than `id`
     */
    entityKey?: string

    /**
     * We can provide custom `entityId` to link the operation to some entity page (like user, product, etc.)
     * in case the response does not not conform to the standard response format
     */
    entityId?: string | number

    /**
     * When true, the error will not be logged
     */
    noLog?: boolean | ((res: any) => boolean)
  }

  /**
   * For custom error handling, we can inject our own function to handle the error
   * The function should return an array of strings of errors
   */
  errorGetter?: (error: any) => string[]

  /**
   * When valid request is done, we call this function
   */
  onComplete?: () => void

  /**
   * When the request is done, the `onNotify` function will be called
   */
  onNotify?: (payload: {
    payload: any
    errorMessages?: string[]
    type?: 'positive' | 'negative'
  }) => void

  /**
   * The function to handle the error
   */
  onError?: (error: any, res: any) => Promise<any> | any
}

export function useRequest(options?: { loadingInitialState?: boolean }) {
  const { loadingInitialState } = options ?? {}

  // Utils
  const { $i18n } = tryUseNuxtApp() ?? {}
  const $t = $i18n?.t ?? ((...args: any[]) => args[0])

  // Layout
  const errors = ref<string[]>([])
  const isLoading = ref(loadingInitialState ?? false)
  const abortController = ref<AbortController>()

  // Logging
  let temporaryResPayload: any
  let temporaryErrors: any[]

  function createAbortController() {
    abortController.value = new AbortController()

    return abortController.value
  }

  async function handleRequest<T = any>(
    fnc: AsyncFunction<T>,
    options?: UseRequestOptions,
  ): Promise<T> {
    const {
      errorGetter,
      payloadKey,
      noResolve = true,
      merge: _merge,
      $z,
      onNotify,
      onComplete,
    } = options || {}

    try {
      // Initialize
      temporaryErrors = []
      temporaryResPayload = undefined

      // Validate
      if ($z) {
        const isValid = await $z.value.$validate()

        if (!isValid) {
          throw new Error('general.invalidForm')
        }
      }

      isLoading.value = true

      const res = (await fnc(createAbortController)) as any
      const resPayload = get(res, payloadKey || utilsConfig.request.payloadKey)

      temporaryResPayload = resPayload

      // If response is an array and includes some errors, we throw an error
      const isResponseArray = Array.isArray(resPayload)
      const hasArrayResponseError = isResponseArray && resPayload.some((item: any) => item.error)

      // Custom error handling
      if (errorGetter) {
        temporaryErrors = errorGetter(res)

        if (temporaryErrors.length) {
          throw new CustomError(temporaryErrors)
        }
      }

      // When we get an array response with some errors
      if (hasArrayResponseError) {
        throw new CustomError(resPayload.map((item: any) => item.error))
      }

      // NOTE: We shouldn't need to handle a case for a error response, because that
      // should come as an actual error code, so it should automatically be handled
      // in the `catch` block

      // When `merge` is used, we merge the response with the original object
      if (_merge) {
        const newData = _merge.payloadKey ? get(res, _merge.payloadKey) : res
        const modifyFnc = _merge.modifyFnc ?? (utilsConfig.request.modifyFnc || ((obj: any) => obj))
        const newDataModified = modifyFnc(newData)

        if (newData) {
          // When `merge.override` is true, we sync the original object with the new data
          // essentially replacing the original object
          if (_merge.override) {
            _merge.originalObj.syncToParent(newDataModified)
          }

          // Otherwise, we merge the new data with the original object
          else {
            const originalObj = toValue(_merge.originalObj)
            const resultObj = Object.assign(originalObj, newDataModified)

            _merge.originalObj.syncToParent?.(resultObj)
          }
        }
      }

      // Notify about success
      onNotify?.({ payload: resPayload, type: 'positive' })

      onComplete?.()
      $z?.value.$reset()

      return (noResolve ? res : resPayload) as T
    } catch (error: any) {
      let errors: string[] = []

      const errorHandler = utilsConfig.request.errorHandler ?? ((err: any, _t: any) => err)

      if (Array.isArray(error.errors) && error.errors.length) {
        const errorsFlat = error.errors.flatMap((err: any) => err)

        errors = errorsFlat.flatMap((err: any) => errorHandler(err, $t))
      } else {
        errors = errorHandler(error, $t)
      }

      temporaryErrors = errors

      return new Promise((_resolve, reject) => reject(error))
    } finally {
      isLoading.value = false

      if (onNotify) {
        const uniqueErrors = uniq(temporaryErrors)

        if (uniqueErrors.length) {
          onNotify({
            payload: temporaryResPayload,
            errorMessages: uniqueErrors,
            type: 'negative',
          })
        }
      }

      if (options?.onError && temporaryErrors.length) {
        await options.onError(temporaryErrors, temporaryResPayload)
      }

      isLoading.value = false
    }
  }

  return {
    errors,
    isLoading,
    abortController,
    handleRequest,
  }
}
