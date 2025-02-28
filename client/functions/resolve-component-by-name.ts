import { componentsImportByName } from '$components'

export function resolveComponentByName(componentName: string): Component {
  const loader = componentsImportByName[componentName]
  console.log('Log ~ resolveComponentByName ~ loader:', loader)

  if (!loader) {
    return componentName as unknown as Component
  }

  return defineAsyncComponent(loader)
}
