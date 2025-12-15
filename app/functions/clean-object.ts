/**
 * Will remove all `null` and `undefined` values from the object
 */
export function cleanObject(obj?: IItem | null) {
  if (!obj) {
    return {}
  }

  return Object.entries(obj).reduce((agg, [key, value]) => {
    if (!isNil(value)) {
      agg[key] = value
    }

    return agg
  }, {} as IItem)
}
