import type { ComponentInternalInstance } from 'vue'

/**
 * Will return the name of the current component
 */
export function getComponentName(component?: ComponentInternalInstance | null) {
  if (!component) {
    return
  }

  return (component.type.name || component.type.__name) as string
}
