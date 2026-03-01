import type { Ref } from 'vue'
import type { MaybeRefOrGetter } from '@vueuse/core'

export type UseFnPayload<T = any> = {
  /**
   * The fn ID
   */
  fnId?: string

  /**
   * The function to modify the response object
   */
  modifyResultFn?: (response: any) => any

  /**
   * Ark validation output (the result from `useArk`)
   */
  validation?: IValidation

  /**
   * We can merge the response with the original object
   */
  merge?: {
    /**
     * The key for the payload object (specifically for the `merge` functionality)
     * Can be different from the `payloadKey`
     */
    payloadKey?: string

    /**
     * The original object
     */
    originalObj: MaybeRefOrGetter<any>

    /**
     * Override the original object with the modified object
     * By default, the original object will be merged with the new object (via Object.assign)
     */
    override?: boolean

    /**
     * When provided, the `syncFromParent` will be called once the merge is done
     *
     * NOTE: This requires the `syncOnMerge` to be a result from the `useRefReset` composable
     */
    syncOnMerge?: Ref<any>

    /**
     * The function to modify the response object
     */
    modifyResultFn?: (response: any) => any
  }

  /**
   * When valid fn is done, we call this function
   */
  onComplete?: (payload: { response: any, result: T, fnPayload: Omit<UseFnPayload<T>, 'onComplete' | 'onError'> }) => void

  /**
   * The function to handle the error
   */
  onError?: (payload: { error: any, response: any, fnPayload: Omit<UseFnPayload<T>, 'onComplete' | 'onError'> }) => Promise<any> | any
}
