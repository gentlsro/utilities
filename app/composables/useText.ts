// Functions
import { normalizeText } from '../../shared/utils/normalize-text'
import { createTextShortcut } from '../../shared/utils/create-text-shortcut'

export function useText() {
  return { normalizeText, createShortcut: createTextShortcut }
}
