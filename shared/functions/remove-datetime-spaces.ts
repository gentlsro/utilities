/**
 * Removes spaces from a datetime string
 *
 * For example, for czech locale, the date would be formatted as `Čtvrtek 29. 05. 2025` by default
 * This function would return `Čtvrtek 29.05.2025`
 */
export function removeDatetimeSpaces(datetime: string) {
// This regex targets spaces that are:
  // 1. Preceded by a digit and a literal dot: `(?<=\d\.)` (positive lookbehind)
  // 2. Followed by a digit: `(?=\d)` (positive lookahead)
  // The `\s` matches the space itself.
  // The `g` flag ensures all occurrences are replaced.
  const regexForDateSpaces = /(?<=\d\.)\s(?=\d)/g

  // Replace the specific spaces identified by the regex
  let cleanedString = datetime.replace(regexForDateSpaces, '')

  // Now, handle the specific time format for consistency if present,
  // similarly targeting spaces after colons when followed by a digit.
  const regexForTimeSpaces = /(?<=:\s*)\s(?=\d)/g
  cleanedString = cleanedString.replace(regexForTimeSpaces, '')

  return cleanedString
}
