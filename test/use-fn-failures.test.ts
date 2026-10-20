// Failure modes: rejection wraps the original error in the shared `error` Ref; a call started before the rejection
// is read resets that Ref and blanks it; onError no longer gets the error; loading stays on after a failure.
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

vi.mock('$utilsConfig', () => ({ utilsConfig: { fn: {} } }))
vi.stubGlobal('ref', ref)

const { useFn } = await import('../app/composables/useFn')

describe('useFn request failures', () => {
  it('rejects with the original error and gives it to onError', async () => {
    const failure = new Error('search failed')
    const onError = vi.fn()
    const request = useFn()

    await expect(request.fn(async () => {
      throw failure
    }, { onError })).rejects.toBe(failure)
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ error: failure }))
    expect(request.isLoading.value).toBe(false)
  })

  it('keeps the rejection when another call starts before it is read', async () => {
    const failure = new Error('search failed')
    const request = useFn()

    const failed = request.fn(async () => {
      throw failure
    }, { onError: vi.fn() })
    const rejection = await failed.catch(error => error)

    // The next call resets the shared error state
    await request.fn(async () => 'next search', { onComplete: vi.fn() })

    expect(rejection).toBe(failure)
  })
})
