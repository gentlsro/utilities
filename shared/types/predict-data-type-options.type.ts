export type PredictDataTypeOptions<T extends IItem = IItem> = {
  rows: T[]
  field: string
  useSimple?: boolean

  /**
   * The amount of rows to consider for the prediction
   *
   * If not provided, we will consider all the rows
   */
  rowsToConsider?: number
}
