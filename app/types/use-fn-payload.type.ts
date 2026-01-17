export type UseFnPayload<T = any> = {
  /**
   * The fn ID
   */
  fnId?: string

  /**
   * The function to modify the response object
   */
  modifyResultFn?: (obj: any) => any

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
     * The function to modify the response object
     */
    modifyResultFn?: (obj: any) => any
  }

  /**
   * When valid fn is done, we call this function
   */
  onComplete?: (payload: { response: any, result: T }) => void

  /**
   * The function to handle the error
   */
  onError?: (payload: { error: any, response: any }) => Promise<any> | any
}
