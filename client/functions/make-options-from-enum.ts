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

  // Get all keys and values
  const allKeys = Object.keys(enumObj)
  const allValues = Object.values(enumObj)

  // Check if this is a numeric enum by testing if values are numbers
  // Numeric enums have reverse mappings, so we need to filter out numeric keys
  const isNumericEnum = allValues.some(val => typeof val === 'number')

  let enumKeys: string[]
  let enumValues: any[]

  if (isNumericEnum) {
    // For numeric enums, filter out numeric keys (keep only string keys which are the enum member names)
    enumKeys = allKeys.filter(key => !/^\d+$/.test(key))
    enumValues = enumKeys.map(key => enumObj[key])
  } else {
    // For string enums, use all keys (no reverse mapping exists)
    enumKeys = allKeys
    enumValues = enumKeys.map(key => enumObj[key])
  }

  if (isNumericEnum) {
    return enumKeys.map(key => {
      const value = enumObj[key]
      return {
        [labelField]: $t(`${translationPrefix}.${transformKey(value)}`),
        [keyField]: numericValue ? Number.parseInt(String(value)) : transformKey(String(value)),
      }
    })
  } else {
    return enumKeys.map(key => {
      const value = enumObj[key]

      return {
        [labelField]: $t(`${translationPrefix}.${transformKey(String(value))}`),
        [keyField]: value,
      }
    })
  }
}
