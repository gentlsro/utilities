import { uniq } from 'lodash-es'
import type { ExtendedDataType } from '$dataType'
import utilsConfig from '$utilsConfig'

const DEFAULT_DATE_TIME_DATA_TYPES: ExtendedDataType[] = [
  'date',
  'datetime',
  'yearMonth',
  'timestamp',
  'fullDateTime',
]

export function getDateTypes(dateTimeDataTypes: ExtendedDataType[] = []) {
  const configured = utilsConfig.dataTypeExtend.dateTimeDataTypes ?? DEFAULT_DATE_TIME_DATA_TYPES

  return uniq([...configured, ...dateTimeDataTypes])
    .flatMap(type => [type, `${type}Simple`] as ExtendedDataType[])
}

const DEFAULT_NUMBER_DATA_TYPES: ExtendedDataType[] = [
  'number',
  'numberSimple',
]

export function getNumberDataTypes(extraDataTypes: ExtendedDataType[] = []) {
  const configured = utilsConfig.dataTypeExtend.numberDataTypes ?? DEFAULT_NUMBER_DATA_TYPES

  return uniq([...configured, ...extraDataTypes])
}

export function isNumberDataType(dataType: ExtendedDataType) {
  return getNumberDataTypes().includes(dataType)
}
