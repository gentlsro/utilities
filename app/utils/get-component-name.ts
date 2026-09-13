/**
 * Will return the name of the current component
 */
export function getComponentName(component?: { type: { name?: string, __name?: string } } | null) {
  if (!component) {
    return
  }

  return (component.type.name || component.type.__name) as string
}
