/**
 * Replace all non-alphanumeric characters with the replacement character
 */
export function replaceNonAlphanumeric(input: string, char = '-'): string {
  const replacedString = input.replace(/[^a-z0-9]/gi, char)

  // Create a regular expression to match multiple consecutive replacement characters
  const consecutiveCharsRegex = new RegExp(`${char}+`, 'g')

  // Replace multiple consecutive replacement characters with a single character
  const resultString = replacedString.replace(consecutiveCharsRegex, char)

  // Create a regular expression to remove leading or trailing replacement characters
  const leadingTrailingCharsRegex = new RegExp(`^${char}|${char}$`, 'g')

  // Remove leading or trailing replacement characters
  return resultString.replace(leadingTrailingCharsRegex, '')
}
