export type IDateOptions = {
  localeIso?: string
  isLocalString?: boolean
  outputIntlOptions?: Intl.DateTimeFormatOptions | DateFormatPreset
  format?: string

  /**
   * When true, the spaces between the date parts will be removed
   * For exmaple, for czech locale, the date would be formatted as `29. 05. 2025` by default
   * but with `removeSpaces: true` it would be formatted as `29.05.2025`
   */
  removeSpaces?: boolean
}
