export function useSemiRandom() {
  /**
   * FNV-1a hash - better distribution than djb2 for similar strings
   */
  function hashString(str: string): number {
    // Handle empty string case
    if (!str) {
      return 2166136261 // FNV offset basis as fallback
    }

    let hash = 2166136261 // FNV offset basis

    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i)
      // FNV prime multiplication with 32-bit overflow handling
      hash = Math.imul(hash, 16777619)
    }

    // Additional mixing for better distribution with small modulos
    hash ^= hash >>> 16
    hash = Math.imul(hash, 2246822507)
    hash ^= hash >>> 13

    return hash >>> 0 // Convert to unsigned 32-bit integer
  }

  function semiRandomPick<T>(array: T[], str: string): T | undefined {
    if (!array || array.length === 0) {
      return undefined
    }

    if (array.length === 1) {
      return array[0]
    }

    const hashValue = hashString(str)
    const index = hashValue % array.length

    return array[index]
  }

  return { hashString, semiRandomPick }
}
