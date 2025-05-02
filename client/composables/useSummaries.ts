import { get, set } from 'lodash-es'
import type { IGroupRow } from '$utils'
import type { IGroupedItem } from '../../shared/composables/useGrouping'

// Models
import { SummaryEnum } from '../../shared/enums/summary.enum'
import type { SummaryItem } from '../../shared/models/summary-item.model'

type IInputItem = IGroupedItem<IItem> | IGroupRow
type IResultItem = { id: string, field: string, label?: string | ((value: number) => string), value: number, row: IGroupedItem<IItem> | IGroupRow }

export function useSummaries() {
  const createSummaries = <T = IItem>(
    groupedArrayRef: MaybeRefOrGetter<IInputItem[]>,
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
      if ('isGroup' in row) {
        summaries.forEach(summary => {
          const value = calculateSummary(summary, row.dataObj)

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
      }
    })

    return result
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

  return { createSummaries }
}
