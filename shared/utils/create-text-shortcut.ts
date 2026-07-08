export function createTextShortcut(text: string, maxLength = 5): string {
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
