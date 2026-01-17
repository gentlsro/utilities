import type { UseFnPayload } from '../types/use-fn-payload.type'

export function $fn<T = any>(
  fnc: AsyncFunction<T>,
  options?: UseFnPayload<T>,
) {
  const { fn } = useFn()

  return fn(fnc, options)
}
