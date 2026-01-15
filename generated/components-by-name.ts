import type { AsyncComponentLoader, Component } from 'vue'
export const componentsImportByName: Record<string, AsyncComponentLoader<Component>> = {}
