export function useText() {
  function normalizeText(
    txt: string,
    options?: {
      lowerCase?: boolean
      removeConsecutiveSpaces?: boolean
    },
  ) {
    let normalizedText = ''
    const { lowerCase = true } = options || {}

    if (typeof txt !== 'string') {
      return txt
    }

    if (lowerCase) {
      normalizedText = txt
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036F]/g, '')
        .replace(/[^a-z0-9\s]/gi, '')
    } else {
      normalizedText = txt
        .normalize('NFKD')
        .replace(/[\u0300-\u036F]/g, '')
        .replace(/[^a-z0-9\s]/gi, '')
    }

    if (options?.removeConsecutiveSpaces) {
      return normalizedText.replace(/\s+/g, ' ')
    }

    return normalizedText
  }

  function createShortcut(text: string, maxLength = 5): string {
    if (text.length <= 1) {
      return text
    }

    if (!text.includes(' ')) {
      return `${text[0]}${text[text.length - 1]}`
    }

    return text
      .split(' ')
      .map(s => s[0])
      .join('')
      .toUpperCase()
      .slice(0, maxLength)
  }

  return { normalizeText, createShortcut }
}
