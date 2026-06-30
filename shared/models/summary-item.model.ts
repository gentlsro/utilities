import type { Required } from 'utility-types'

// Types
import type { ObjectKey } from '../types/object-key.type'

// Models
import { SummaryEnum } from '../enums/summary.enum'

export class SummaryItem<T = any> {
  field: ObjectKey<T>
  label?: string | ((value: number) => string)
  summaryFormat?: (row: T) => number
  summaryType: SummaryEnum = SummaryEnum.COUNT

  constructor(obj: Required<Partial<SummaryItem<T>>, 'field'>) {
    this.field = obj.field
    this.label = obj.label
    this.summaryFormat = obj.summaryFormat
    this.summaryType = obj.summaryType ?? SummaryEnum.COUNT
  }
}
