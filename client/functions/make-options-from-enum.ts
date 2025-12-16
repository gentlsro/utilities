/**
 * Will create an array of options from the given enum object
 */
export function makeSelectorOptionsFromEnum(
  enumObj: IItem,
  translationPrefix: string,
  options?: {
    keyField?: string
    labelField?: string

    transformKey?: (key: string) => string

    /**
     * If set to true, the value will be parsed to integer
     */
    numericValue?: boolean
  },
): IItem[] {
  const {
    keyField = 'id',
    labelField = 'label',
    numericValue = true,
    transformKey = (key: string) => key,
  } = options || {}

  const enumValues = Object.values(enumObj)
  const enumKeys = Object.keys(enumObj)
  const isNumberedEnum = enumKeys.every(key => /^[\d.]+$/.test(enumObj[key]))

  if (isNumberedEnum) {
    return enumValues
      .filter(key => Number.isFinite(Number(key)))
      .map(key => {
        return {
          [labelField]: $t(`${translationPrefix}.${key}`),
          [keyField]: numericValue ? Number.parseInt(key) : transformKey(key),
        }
      })
  } else {
    return Object.keys(enumObj).map(key => {
      const value = enumObj[key]

      return {
        [labelField]: $t(`${translationPrefix}.${transformKey(value)}`),
        [keyField]: value,
      }
    })
  }
}
