import { afterEach, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useRafTask } from './useRafTask'

afterEach(() => vi.unstubAllGlobals())

it('coalesces a burst, flushes the latest release value and cancels on scope disposal', () => {
  const callbacks = new Map<number, FrameRequestCallback>()
  let id = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callbacks.set(++id, callback)

    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (frame: number) => callbacks.delete(frame))
  const apply = vi.fn()
  const scope = effectScope()
  const task = scope.run(() => useRafTask(apply))!
  try {
    task.schedule(10)
    task.schedule(20)
    task.schedule(30)
    expect(callbacks.size).toBe(1)
    expect(apply).not.toHaveBeenCalled()
    callbacks.values().next().value!(0)
    expect(apply).toHaveBeenCalledExactlyOnceWith(30)
    expect(callbacks.size).toBe(0)

    task.schedule(40)
    task.schedule(50)
    task.flush()
    expect(apply).toHaveBeenLastCalledWith(50)
    expect(apply).toHaveBeenCalledTimes(2)
    expect(callbacks.size).toBe(0)

    task.schedule(60)
    task.cancel()
    task.flush()
    task.schedule(70)
    scope.stop()
    expect(callbacks.size).toBe(0)
    expect(apply).toHaveBeenCalledTimes(2)
  } finally {
    scope.stop()
  }
})
