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

  const enumKeys = Object.keys(enumObj).slice(0, Object.keys(enumObj).length / 2)
  const enumValues = Object.values(enumObj).slice(0, Object.values(enumObj).length / 2)
  const isNumberedEnum = enumKeys.every(key => /^[\d.]+$/.test(key))

  if (isNumberedEnum) {
    return enumKeys
      .map(value => {
        return {
          [labelField]: $t(`${translationPrefix}.${value}`),
          [keyField]: numericValue ? Number.parseInt(value) : transformKey(value),
        }
      })
  } else {
    return enumKeys.map((key, idx) => {
      const value = enumValues[idx]

      return {
        [labelField]: $t(`${translationPrefix}.${transformKey(value)}`),
        [keyField]: key,
      }
    })
  }
}
