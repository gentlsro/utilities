import type { AllowedComponentProps, Component, Raw, VaporComponent, VNodeProps } from 'vue'
import type { ComponentProps as VueComponentProps } from 'vue-component-type-helpers'

export type ComponentProps<C extends Component | VaporComponent> = {
  [K in keyof VueComponentProps<C> as K extends keyof VNodeProps | keyof AllowedComponentProps
    ? never : K]: VueComponentProps<C>[K]
}

export type IComponent<T extends Component | VaporComponent> = {
  component: Raw<T>
  props?: ComponentProps<T>
  icon: string
}
