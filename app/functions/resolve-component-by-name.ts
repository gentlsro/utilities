import { componentsImportByName } from '$components'

export function resolveComponentByName(componentName: string): Component {
  const loader = componentsImportByName[componentName]

  if (!loader) {
    return componentName as unknown as Component
  }

  return defineAsyncComponent(loader)
}
