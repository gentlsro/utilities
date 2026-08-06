// Models
import { SummaryEnum } from '../enums/summary.enum'
import type { SummaryItem } from '../models/summary-item.model'

type IResultItem = {
  id: string
  field: string
  label?: string | ((value: number) => string)
  value: number
  row: IGroupRow
}

export function useSummaries() {
  const createSummaries = <T extends IItem = IItem>(
    groupedArrayRef: MaybeRefOrGetter<Array<T | IGroupRow>>,
    summariesRef: MaybeRefOrGetter<SummaryItem<T>[]>,
    options?: {
      /**
       * When true, the `summary` property of the grouped array will be mutated in-place
       */
      mutateGroupedArray?: boolean
    },
  ) => {
    const { mutateGroupedArray = false } = options ?? {}

    const groupedArray = toValue(groupedArrayRef)
    const summaries = toValue(summariesRef)
    const result: IResultItem[] = []

    groupedArray.forEach(row => {
      if (!isGroupRow(row)) {
        return
      }

      summaries.forEach(summary => {
        const value = Math.round(calculateSummary(summary, row.dataObj) * 100) / 100

        if (mutateGroupedArray) {
          row.summary = {
            ...row.summary,
            [summary.field]: {
              label: summary.label,
              value,
            },
          }
        }

        result.push({
          id: row.id,
          field: summary.field,
          label: summary.label ?? row.label,
          value,
          row,
        })
      })
    })

    return result
  }

  function isGroupRow(row: unknown): row is IGroupRow {
    return !!row
      && typeof row === 'object'
      && 'isGroup' in row
      && (row as IGroupRow).isGroup === true
  }

  function getRowValue<T = IItem>(row: T, summaryItem: SummaryItem): number {
    let value: number

    if ('summaryFormat' in summaryItem && summaryItem.summaryFormat) {
      value = summaryItem.summaryFormat?.(row)
    } else {
      value = get(row, summaryItem.field)
    }

    if (typeof value === 'number') {
      return value
    }

    return 0
  }

  const calculateSummary = <T = IItem>(
    summaryItem: SummaryItem<T>,
    data: T[],
  ) => {
    let values: number[] = []
    let value: number = 0

    switch (summaryItem.summaryType) {
      case SummaryEnum.COUNT:
        return data.length

      case SummaryEnum.SUM:
        return data.reduce((agg, row) => (agg += getRowValue(row, summaryItem)), 0)

      case SummaryEnum.MEDIAN:
        values = data.map(row => getRowValue(row, summaryItem))
        values = values.toSorted((a, b) => a - b)

        return values[Math.floor(values.length / 2)] as number

      case SummaryEnum.AVERAGE:
        value = data.reduce((agg, row) => (agg += getRowValue(row, summaryItem)), 0)

        return value / data.length

      default:
        return data.length
    }
  }

  return { createSummaries, getRowValue, calculateSummary }
}
