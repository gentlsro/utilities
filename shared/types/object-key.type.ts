// @ts-nocheck Some stupid fucking excessively deep bullshit
// A type guard to check if a value should be treated as a primitive
type Primitive = string | number | boolean | null | undefined | Function | Date

// Adjusted Path type to conditionally include the dot
type Path<T extends string | number, U extends string> = U extends ''
  ? `${T}`
  : `${T}${'' extends U ? '' : '.'}${U}`

// NOTE It's possible to change the depth of the path by changing the number in the PathKeys type
type PathKeys<T, D extends number = 3> = [D] extends [never]
  ? never
  : T extends Primitive
    ? ''
    : T extends Array<infer U>
      ? PathKeys<U, Prev[D]>
      : T extends object
        ? {
            [K in keyof T]-?: K extends string | number
              ? Path<K, PathKeys<T[K], Prev[D]>>
              : never
          }[keyof T]
        : never

type Prev = [never, 0, 1, 2, 3, 4]

/**
 * Extracts the keys of an object
 *
 * NOTE: No fucking idea how this works, all chatgpt...
 */
export type ObjectKey<T> = PathKeys<T>

/**
 * Base interface for validation node metadata
 * Uses $ prefix to avoid collision with user object keys
 */
export type ValidationNodeBase<TError = unknown> = {
  readonly $path: string
  readonly $errors: TError[]
  readonly $invalid: boolean
  readonly $required: boolean
  $validate: (payload?: { shouldResume?: boolean }) => void
  $reset: (payload?: { shouldPause?: boolean }) => void
}

/**
 * Helper type to unwrap optional types (T | undefined | null -> T)
 */
type UnwrapOptional<T> = NonNullable<T>

/**
 * Recursive type that creates a nested validation structure
 * Each node has validation metadata ($path, $errors, etc.) plus child properties
 *
 * Handles optional fields by unwrapping T | undefined before processing
 *
 * @example
 * // For type { email: string, arr?: { name: string }[] }
 * // Results in:
 * // {
 * //   $path, $errors, $invalid, $required, $validate, $reset,
 * //   email: { $path, $errors, $invalid, $required, $validate, $reset },
 * //   arr: {
 * //     $path, $errors, $invalid, $required, $validate, $reset,
 * //     [index: number]: {
 * //       $path, $errors, $invalid, $required, $validate, $reset,
 * //       name: { $path, $errors, $invalid, $required, $validate, $reset }
 * //     }
 * //   }
 * // }
 */
export type ValidationNode<T, TError = unknown, D extends number = 4> = ValidationNodeBase<TError> & (
  [D] extends [never]
    ? NonNullable<unknown>
    : UnwrapOptional<T> extends Primitive
      ? NonNullable<unknown>
      : UnwrapOptional<T> extends Array<infer U>
        ? { readonly [index: number]: ValidationNode<U, TError, Prev[D]> }
        : UnwrapOptional<T> extends object
          ? { readonly [K in keyof UnwrapOptional<T>]: ValidationNode<UnwrapOptional<T>[K], TError, Prev[D]> }
          : NonNullable<unknown>
)
