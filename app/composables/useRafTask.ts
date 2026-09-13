// @vapor-ready — scheduling belongs to the caller's effect scope, not its renderer.

/** Coalesce pending updates; flush before committing a gesture, cancel when abandoning it. */
export function useRafTask<T>(callback: (value: T) => void) {
  let frame: number | undefined
  let pending: { value: T } | undefined

  function cancel() {
    if (frame !== undefined) {
      cancelAnimationFrame(frame)
      frame = undefined
    }
    pending = undefined
  }

  function flush() {
    const task = pending
    cancel()
    if (task) {
      callback(task.value)
    }
  }

  function schedule(value: T) {
    pending = { value }
    if (frame === undefined) {
      frame = requestAnimationFrame(flush)
    }
  }

  onScopeDispose(cancel)

  return { schedule, flush, cancel }
}
