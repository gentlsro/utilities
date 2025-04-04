import type { AllowedComponentProps, Raw, VNodeProps } from 'vue'

export type ComponentProps<C extends Component> = C extends new (
  ...args: any
) => any
  ? Omit<
    InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
  >
  : never

export type IComponent<T extends Component> = {
  component: Raw<T>
  props?: ComponentProps<T>
  icon: string
}
