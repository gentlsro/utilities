export type IQueueItem = {
  id: string
  fnc: () => Promise<unknown>
  revert?: () => Promise<void> | void
}
