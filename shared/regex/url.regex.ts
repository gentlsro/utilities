const regex
  = /^(https?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.)([\w-.@:%+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/

const without_regex
  = /^[\w-.@:%+~#=]+((\.[a-z]{2,3})+)(\/.*)?(\?(.)*)?/i

export function isUrl(value: string): boolean {
  const isUrlWithProtocol = regex.test(value)
  const isUrlWithoutProtocol = without_regex.test(value)

  return isUrlWithProtocol || isUrlWithoutProtocol
}
