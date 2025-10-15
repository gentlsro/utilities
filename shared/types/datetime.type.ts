import type { Dayjs } from 'dayjs'
import type { ExtendedDataType } from '$dataType'

export type Datetime = Dayjs | number | string | Date | null | undefined

export type DatetimeStrict = Dayjs | number | string | Date

export const DATE_TYPES: ExtendedDataType[] = [
  'date',
  'yearMonth',
  'datetime',
  'timestamp',
].flatMap(type => [type, `${type}Simple`] as ExtendedDataType[])
