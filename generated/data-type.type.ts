
export type DataType =
| 'string'
| 'number'
| 'percent'
| 'currency'
| 'duration'
| 'date'
| 'datetime'
| 'yearMonth'
| 'timestamp'
| 'fullDateTime'
| 'boolean'
| 'bool'
| 'time'
| 'custom'

type SimpleDataType = `${DataType}Simple`

export type ExtendedDataType = DataType | SimpleDataType