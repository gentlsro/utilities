import { computed, effectScope, ref, watch } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAsyncQueue } from '../app/composables/useAsyncQueue'

vi.stubGlobal('computed', computed)
vi.stubGlobal('ref', ref)
vi.stubGlobal('watch', watch)

function withQueue<T>(
  run: (queue: ReturnType<typeof useAsyncQueue>) => Promise<T>,
) {
  const scope = effectScope()
  const queue = scope.run(() => useAsyncQueue())

  if (!queue) {
    throw new Error('Failed to create async queue')
  }

  return run(queue).finally(() => scope.stop())
}

describe('useAsyncQueue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs items in enqueue order', async () => {
    await withQueue(async queue => {
      const order: string[] = []

      await Promise.all([
        queue.enqueue({
          id: 'first',
          fnc: async () => {
            order.push('first')
          },
        }),
        queue.enqueue({
          id: 'second',
          fnc: async () => {
            order.push('second')
          },
        }),
        queue.enqueue({
          id: 'third',
          fnc: async () => {
            order.push('third')
          },
        }),
      ])

      expect(order).toEqual(['first', 'second', 'third'])
    })
  })

  it('waits for an earlier item before starting the next', async () => {
    await withQueue(async queue => {
      const events: string[] = []
      let releaseFirst!: () => void
      const firstGate = new Promise<void>(resolve => {
        releaseFirst = resolve
      })

      const first = queue.enqueue({
        id: 'first',
        fnc: async () => {
          events.push('first-start')
          await firstGate
          events.push('first-end')
        },
      })
      const second = queue.enqueue({
        id: 'second',
        fnc: async () => {
          events.push('second')
        },
      })

      expect(events).toEqual(['first-start'])
      releaseFirst()

      await Promise.all([first, second])
      expect(events).toEqual(['first-start', 'first-end', 'second'])
    })
  })

  it('calls revert on throw and still runs later items', async () => {
    await withQueue(async queue => {
      const events: string[] = []

      const failed = queue.enqueue({
        id: 'fail',
        fnc: async () => {
          throw new Error('nope')
        },
        revert: () => {
          events.push('reverted')
        },
      })
      const later = queue.enqueue({
        id: 'ok',
        fnc: async () => {
          events.push('later')

          return 'done'
        },
      })

      await expect(failed).rejects.toThrow('nope')
      await expect(later).resolves.toBe('done')
      expect(events).toEqual(['reverted', 'later'])
    })
  })

  it('does not stall the queue when revert throws', async () => {
    await withQueue(async queue => {
      const failed = queue.enqueue({
        id: 'fail',
        fnc: async () => {
          throw new Error('nope')
        },
        revert: async () => {
          throw new Error('revert-fail')
        },
      })
      const later = queue.enqueue({
        id: 'ok',
        fnc: async () => 'done',
      })

      await expect(failed).rejects.toThrow('nope')
      await expect(later).resolves.toBe('done')
    })
  })

  it('resolves whenIdle after the last item', async () => {
    await withQueue(async queue => {
      let finished = false

      void queue.enqueue({
        id: 'slow',
        fnc: async () => {
          await new Promise(resolve => setTimeout(resolve, 20))
          finished = true
        },
      })

      await queue.whenIdle()
      expect(finished).toBe(true)
    })
  })

  it('does not call revert when fnc returns without throwing', async () => {
    await withQueue(async queue => {
      const revert = vi.fn()

      await queue.enqueue({
        id: 'skip',
        fnc: async () => undefined,
        revert,
      })

      expect(revert).not.toHaveBeenCalled()
    })
  })
})
