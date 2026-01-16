import type { UseFnPayload } from '../types/use-fn-payload.type'

export type AsyncFunction<T> = (abortController: () => AbortController) => Promise<T>

export function $fn<T = any>(
  fnc: AsyncFunction<T>,
  options?: UseFnPayload<T>,
) {
  const { fn } = useFn()

  return fn(fnc, options)
}
