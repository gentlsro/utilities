/**
 * Transliteration from cyrillic to latin
 */
export function transliterate(
  word: string = '',
  options?: {
    allowedCharsRegex?: RegExp
    returnUnmatched?: boolean
    lowerCase?: boolean
  },
): string {
  const {
    allowedCharsRegex = /^[0-9a-z ]+$/i,
    returnUnmatched = false,
    lowerCase = true,
  } = options || {}

  const map = new Map<string, string>([
    ['А', 'a'],
    ['а', 'a'],
    ['Б', 'b'],
    ['б', 'b'],
    ['В', 'v'],
    ['в', 'v'],
    ['Г', 'g'],
    ['г', 'g'],
    ['Д', 'd'],
    ['д', 'd'],
    ['Ђ', 'dj'],
    ['ђ', 'dj'],
    ['Е', 'e'],
    ['е', 'e'],
    ['Ж', 'z'],
    ['ж', 'z'],
    ['З', 'z'],
    ['з', 'z'],
    ['И', 'i'],
    ['и', 'i'],
    ['Ј', 'j'],
    ['ј', 'j'],
    ['К', 'k'],
    ['к', 'k'],
    ['Л', 'l'],
    ['л', 'l'],
    ['Љ', 'lj'],
    ['љ', 'lj'],
    ['М', 'm'],
    ['м', 'm'],
    ['Н', 'n'],
    ['н', 'n'],
    ['Њ', 'nj'],
    ['њ', 'nj'],
    ['О', 'o'],
    ['о', 'o'],
    ['П', 'p'],
    ['п', 'p'],
    ['Р', 'r'],
    ['р', 'r'],
    ['С', 's'],
    ['с', 's'],
    ['Т', 't'],
    ['т', 't'],
    ['Ћ', 'c'],
    ['ћ', 'c'],
    ['У', 'u'],
    ['у', 'u'],
    ['Ф', 'f'],
    ['ф', 'f'],
    ['Х', 'h'],
    ['х', 'h'],
    ['Ц', 'c'],
    ['ц', 'c'],
    ['Ч', 'c'],
    ['ч', 'c'],
    ['Џ', 'dz'],
    ['џ', 'dz'],
    ['Ш', 's'],
    ['ш', 's'],
    ['Č', 'c'],
    ['č', 'c'],
    ['Ć', 'c'],
    ['ć', 'c'],
    ['Š', 's'],
    ['š', 's'],
    ['Đ', 'dj'],
    ['đ', 'dj'],
    ['Ž', 'z'],
    ['ž', 'z'],
  ])

  return Array.from(word)
    .map(char => {
      if (map.has(char)) {
        return map.get(char)
      }

      if (returnUnmatched || allowedCharsRegex?.test(char)) {
        return char
      }

      return ''
    })
    .map(char => lowerCase ? char!.toLowerCase() : char)
    .join('')
}
