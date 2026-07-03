import { uniq } from 'lodash-es'
import type { ExtendedDataType } from '$dataType'

export type Datetime = Dayjs | number | string | Date | null | undefined
export type DatetimeStrict = Dayjs | number | string | Date

const DEFAULT_DATE_TIME_DATA_TYPES: ExtendedDataType[] = [
  'date',
  'datetime',
  'yearMonth',
  'timestamp',
  'fullDateTime',
]

export function getDateTypes(dateTimeDataTypes: ExtendedDataType[] = []) {
  return uniq([...DEFAULT_DATE_TIME_DATA_TYPES, ...dateTimeDataTypes])
    .flatMap(type => [type, `${type}Simple`] as ExtendedDataType[])
}
