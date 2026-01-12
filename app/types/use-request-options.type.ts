// Types
import type { IZodValidationOutput } from './zod'

export type UseRequestOptions<T = any> = {
  /**
   * The request ID
   */
  requestId?: string

  /**
   * The key for the payload object
   *
   * Falls back to the `utilsConfig.request.payloadKey` if not provided
   * Provide `null` to ignore the payload key
   */
  payloadKey?: string | null

  /**
   * The function to modify the response object
   */
  modifyFnc?: (obj: any) => any

  /**
   * Zod validation output (the result from `useZod`)
   */
  $z?: IZodValidationOutput<any>

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
     * The function to modify the response object
     */
    modifyFnc?: (obj: any) => any
  }

  /**
   * When valid request is done, we call this function
   */
  onComplete?: (payload: { response: any, result: T }) => void

  /**
   * The function to handle the error
   */
  onError?: (payload: { error: any, response: any }) => Promise<any> | any
}
