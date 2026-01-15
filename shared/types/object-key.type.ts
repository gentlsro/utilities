// @ts-nocheck Some stupid fucking excessively deep bullshit
// A type guard to check if a value should be treated as a primitive
type Primitive = string | number | boolean | null | undefined | Function | Date

// Adjusted Path type to conditionally include the dot
type Path<T extends string | number, U extends string> = U extends ''
  ? `${T}`
  : `${T}${'' extends U ? '' : '.'}${U}`

// NOTE It's possible to change the depth of the path by changing the number in the PathKeys type
// SkipArrayIndex: when true, allows `roles.id` instead of `roles.${number}.id`
type PathKeys<T, D extends number = 3, SkipArrayIndex extends boolean = false> = [D] extends [never]
  ? never
  : T extends Primitive
    ? ''
    : T extends Array<infer U>
      ? SkipArrayIndex extends true
        // Skip array index - treat array as if accessing element directly
        ? PathKeys<U, Prev[D], SkipArrayIndex>
        // Include array index in path
        : PathKeys<U, Prev[D], SkipArrayIndex> extends ''
          ? `${number}`
          : Path<`${number}`, PathKeys<U, Prev[D], SkipArrayIndex>>
      : T extends object
        ? {
            [K in keyof T]-?: K extends string | number
              ? Path<K, PathKeys<T[K], Prev[D], SkipArrayIndex>>
              : never
          }[keyof T]
        : never

type Prev = [never, 0, 1, 2, 3, 4]

/**
 * Extracts the keys of an object
 *
 * @template T - The object type to extract keys from
 * @template SkipArrayIndex - When true, allows `roles.id` instead of `roles.${number}.id`
 *
 * @example
 * // Default behavior (with array index)
 * type Keys = ObjectKey<{ roles: { id: string }[] }>
 * // Result: "roles" | `roles.${number}` | `roles.${number}.id`
 *
 * @example
 * // Skip array index
 * type Keys = ObjectKey<{ roles: { id: string }[] }, true>
 * // Result: "roles" | "roles.id"
 */
export type ObjectKey<T, SkipArrayIndex extends boolean = false> = PathKeys<T, 3, SkipArrayIndex>
