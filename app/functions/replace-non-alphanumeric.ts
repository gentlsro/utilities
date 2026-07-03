/**
 * Replace all non-alphanumeric characters with the replacement character
 */
export function replaceNonAlphanumeric(input: string, char = '-'): string {
  const replacedString = input.replace(/[^a-z0-9]/gi, char)

  // Escape special regex characters in the replacement character
  const escapedChar = char.replace(/[.*+?^${}()[\]\\|]/g, '\\$&')

  // Create a regular expression to match multiple consecutive replacement characters
  const consecutiveCharsRegex = new RegExp(`${escapedChar}+`, 'g')

  // Replace multiple consecutive replacement characters with a single character
  const resultString = replacedString.replace(consecutiveCharsRegex, char)

  // Create a regular expression to remove leading or trailing replacement characters
  const leadingTrailingCharsRegex = new RegExp(`^${escapedChar}|${escapedChar}$`, 'g')

  // Remove leading or trailing replacement characters
  return resultString.replace(leadingTrailingCharsRegex, '')
}
