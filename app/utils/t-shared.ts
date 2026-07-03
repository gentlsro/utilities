// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export function $tShared(...args: any): string {
  if (import.meta.client) {
    return $t(...args)
  } else {
    return (key: string) => key
  }
}