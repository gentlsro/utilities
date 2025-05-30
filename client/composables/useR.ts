import { type } from 'arktype'
import { mergeRegles } from '@regle/core'

type IRegelItem<T> = {
  componentName: string
  regelObject: T
}

/** Gets scope name */
function getScopeName(scope?: string | false | null) {
  if (scope === false || scope === null) {
    return `__r$${generateUUID()}`
  }

  return scope ? `__r$${scope}` : '__r$'
}

export function useR<T>(
  regle?: () => T,
  options?: { scope?: string },
) {
  const { scope } = options ?? {}

  const instance = getCurrentInstance()
  const componentName = `${getComponentName(instance)}_${generateUUID()}`
  const scopeName = getScopeName(scope)
  const result = regle?.() ?? useRegleSchema({}, type({})) as T

  const regleObjects = injectLocal<Ref<IRegelItem<T>[]>>(scopeName, ref([]))

  // Push the regel result on init
  regleObjects.value.push({ regelObject: result, componentName })

  provideLocal(scopeName, regleObjects)

  const merged = computed(() => {
    const regelsByComponentName = regleObjects.value.reduce((agg, obj) => {
      agg[obj.componentName] = (obj.regelObject as IItem).r$

      return agg
    }, {} as IItem)

    return mergeRegles(regelsByComponentName)
  })

  const errorsByField = computed(() => {
    return Object.entries(merged.value.$errors).reduce((agg, [field, err]) => {
      const fieldErrors = get(agg, field) ?? {}

      set(agg, field, { ...fieldErrors, ...err })

      return agg
    }, {} as IItem)
  })

  // Remove the regle object onUnmounted
  tryOnUnmounted(() => {
    regleObjects.value = regleObjects.value.filter(obj => obj !== result)
  })

  return {
    ...result,
    merged,
    errorsByField,
    $validate: (localOnly?: boolean) => localOnly
      // @ts-expect-error
      ? result.$validate?.()
      : merged.value.$validate(),
  }
}
