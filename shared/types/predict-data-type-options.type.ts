export type PredictDataTypeOptions<T extends IItem = IItem> = {
  rows: T[]
  field: string
  useSimple?: boolean
}
