// Failure modes: rejection wraps the original error in a Ref; one request's error contaminates another's callback;
// an overlapping request clears loading while work remains; a callback throws and leaves loading/memoization stuck.
import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

vi.mock('$utilsConfig', () => ({ utilsConfig: { fn: {} } }))
vi.stubGlobal('ref', ref)

const { useFn } = await import('../app/composables/useFn')

describe('useFn request failures', () => {
  it('rejects with the original error and gives it to onError', async () => {
    const failure = new Error('upload rejected')
    const onError = vi.fn()
    const request = useFn()

    await expect(request.fn(async () => {
      throw failure
    }, { onError })).rejects.toBe(failure)
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ error: failure }))
    expect(request.isLoading.value).toBe(false)
  })

  it('keeps failures and success callbacks local to overlapping requests', async () => {
    const request = useFn()
    const failure = new Error('one upload failed')
    let resolveSuccess!: (value: string) => void
    const successGate = new Promise<string>(resolve => {
      resolveSuccess = resolve
    })
    const onComplete = vi.fn()
    const onError = vi.fn()
    const successful = request.fn(() => successGate, { onComplete, onError })

    await expect(request.fn(async () => {
      throw failure
    }, { onError: vi.fn() })).rejects.toBe(failure)
    expect(request.isLoading.value, 'another upload is still pending').toBe(true)
    resolveSuccess('uploaded')
    await expect(successful).resolves.toBe('uploaded')
    expect(onComplete).toHaveBeenCalledOnce()
    expect(onError).not.toHaveBeenCalled()
    expect(request.isLoading.value).toBe(false)
  })

  it('clears loading and memoization when an error callback throws', async () => {
    const request = useFn()
    const failure = new Error('request failed')
    const callbackFailure = new Error('callback failed')

    await expect(request.fn(async () => {
      throw failure
    }, {
      fnId: 'upload-retry',
      onError: () => {
        throw callbackFailure
      },
    })).rejects.toBe(callbackFailure)
    expect(request.isLoading.value).toBe(false)
    await expect(request.fn(async () => 'retry succeeded', { fnId: 'upload-retry' })).resolves.toBe('retry succeeded')
  })
})
