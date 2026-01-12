export type IGroupRow = {
  class?: Record<string, boolean> | string | string[]
  groupIdx: number

  /**
   * Unique group id in format: `<GROUP_A>_|_<GROUP_B>_....`
   * ~ groups are separated by `_|_`
   */
  id: string
  isGroup: true
  label: string
  name: string
  style?: IItem | string
  summary?: Record<string, any>
  value: unknown

  /**
   * Indexes of rows which are contained in this group
   */
  data: number[]

  /**
   * Object of rows which are contained in this group
   */
  dataObj: any[]
}
