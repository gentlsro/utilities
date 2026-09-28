// Creating an `Intl` formatter is expensive (tens of µs) while formatting with an existing
// one is cheap (well under 1µs), and tables format every visible cell, so formatters are
// created once per locale and options. They are immutable, so sharing them is safe.
const numberFormats = new Map<string, Intl.NumberFormat>()
const dateTimeFormats = new Map<string, Intl.DateTimeFormat>()

function getFormatKey(locale?: string, options?: object) {
  return `${locale ?? ''}|${options ? JSON.stringify(options) : ''}`
}

export function getNumberFormat(locale?: string, options?: Intl.NumberFormatOptions) {
  const key = getFormatKey(locale, options)
  let format = numberFormats.get(key)

  if (!format) {
    format = new Intl.NumberFormat(locale, options)
    numberFormats.set(key, format)
  }

  return format
}

export function getDateTimeFormat(locale?: string, options?: Intl.DateTimeFormatOptions) {
  const key = getFormatKey(locale, options)
  let format = dateTimeFormats.get(key)

  if (!format) {
    format = new Intl.DateTimeFormat(locale, options)
    dateTimeFormats.set(key, format)
  }

  return format
}
