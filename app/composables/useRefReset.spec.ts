import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, reactive, ref } from 'vue'
import type { EffectScope } from 'vue'
import { useRefReset } from './useRefReset'

const scopes: EffectScope[] = []

function createReset<T>(create: () => T): T {
  const scope = effectScope()
  scopes.push(scope)

  return scope.run(create)!
}

afterEach(() => {
  scopes.splice(0).forEach(scope => scope.stop())
})

describe('useRefReset without a component instance', () => {
  it('commits a primitive before calling the explicit callback and retains the saved baseline', () => {
    const origin = ref(1)
    const seen: number[] = []
    const onSyncToOrigin = vi.fn((value: number) => {
      expect(origin.value).toBe(value)
      seen.push(value)
    })
    const state = createReset(() => useRefReset(origin, { onSyncToOrigin }))
    state.model.value = 2
    expect(origin.value).toBe(1)
    expect(state.isModified.value).toBe(true)
    expect(onSyncToOrigin).not.toHaveBeenCalled()
    state.syncToOrigin()
    expect(seen).toEqual([2])
    expect(state.isModified.value).toBe(false)
    state.model.value = 3
    state.reset()
    expect(state.model.value).toBe(2)
    expect(seen).toEqual([2])
  })

  it('isolates nested drafts and synchronizes objects and arrays without replacing their identity', () => {
    const object = reactive({ nested: { value: 1 } })
    const objectState = createReset(() => useRefReset(() => object))
    objectState.model.value.nested.value = 2
    expect(object.nested.value).toBe(1)
    objectState.reset()
    expect(objectState.model.value.nested.value).toBe(1)
    objectState.model.value.nested.value = 3
    objectState.syncToOrigin()
    expect(object.nested.value).toBe(3)

    const array = reactive([{ value: 1 }])
    const onSyncToOrigin = vi.fn()
    const arrayState = createReset(() => useRefReset(() => array, { onSyncToOrigin }))
    arrayState.model.value.push({ value: 2 })
    arrayState.syncToParent(undefined, false)
    expect(array).toEqual([{ value: 1 }, { value: 2 }])
    expect(onSyncToOrigin.mock.calls[0][0]).toBe(array)
    arrayState.reset()
    expect(arrayState.model.value).toEqual([{ value: 1 }])
    expect(array).toHaveLength(2)
    arrayState.syncFromParent()
    expect(arrayState.model.value).toEqual(array)
    expect(onSyncToOrigin).toHaveBeenCalledTimes(1)
  })

  it('preserves transformations, setModel and reactive auto-sync without emitting on reads or resets', async () => {
    const origin = ref({ label: ' first ' })
    const autoSync = ref(false)
    const onSyncToOrigin = vi.fn()
    const state = createReset(() => useRefReset(origin, {
      modifyFnc: value => ({ label: value.label.trim() }),
      autoSyncFromOrigin: autoSync,
      onSyncToOrigin,
    }))
    expect(state.model.value).toEqual({ label: 'first' })
    state.setModel({ label: ' saved ' })
    state.model.value.label = 'draft'
    state.reset()
    expect(state.model.value.label).toBe('saved')
    origin.value.label = ' ignored '
    await nextTick()
    expect(state.model.value.label).toBe('saved')
    autoSync.value = true
    origin.value.label = ' refreshed '
    await nextTick()
    expect(state.model.value.label).toBe('refreshed')
    expect(state.isModified.value).toBe(false)
    expect(onSyncToOrigin).not.toHaveBeenCalled()
  })
})
