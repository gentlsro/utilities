// Types
import type { IQueueItem } from '../types/async-queue-item.type'

type IPendingItem = {
  item: IQueueItem
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}

/**
 * Sequential async work queue. A watcher drains the head item until empty so
 * enqueue during a run is not skipped. Failed `fnc` calls `revert`; a failed
 * revert does not stall later items.
 *
 * VueUse also auto-imports `useAsyncQueue`. Import this composable from the
 * Utilities layer when both are in scope.
 */
export function useAsyncQueue() {
  const pending = ref<IPendingItem[]>([])
  const isRunning = ref(false)
  const idleWaiters: Array<() => void> = []

  const items = computed(() => {
    return pending.value.map(entry => entry.item)
  })

  function flushIdleWaiters() {
    if (isRunning.value || pending.value.length) {
      return
    }

    const waiters = idleWaiters.splice(0)
    waiters.forEach(resolve => resolve())
  }

  async function processQueue() {
    if (isRunning.value) {
      return
    }

    isRunning.value = true

    try {
      while (pending.value.length) {
        const current = pending.value[0]

        if (!current) {
          break
        }

        try {
          current.resolve(await current.item.fnc())
        } catch (error) {
          try {
            await current.item.revert?.()
          } catch {
            // Revert must not stall later items
          }

          current.reject(error)
        }

        pending.value.shift()
      }
    } finally {
      isRunning.value = false

      if (pending.value.length) {
        void processQueue()
      } else {
        flushIdleWaiters()
      }
    }
  }

  watch(
    () => pending.value.length,
    length => {
      if (length) {
        void processQueue()
      }
    },
    { flush: 'sync' },
  )

  function enqueue(item: IQueueItem) {
    return new Promise<unknown>((resolve, reject) => {
      pending.value.push({ item, resolve, reject })
    })
  }

  function whenIdle() {
    if (!isRunning.value && !pending.value.length) {
      return Promise.resolve()
    }

    return new Promise<void>(resolve => {
      idleWaiters.push(resolve)
    })
  }

  return {
    items,
    isRunning,
    enqueue,
    whenIdle,
  }
}
