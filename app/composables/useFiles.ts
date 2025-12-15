// Types
import type { IFile } from '../../shared/types/file.type'

// Models
import { FileModel } from '../../shared/models/file.model'

// Provide/Inject
export const filesKey = Symbol('__files')

export function useFiles(name?: string) {
  const { handleRequest } = useRequest()

  const componentName = name ?? (getComponentName(getCurrentInstance()) || generateUUID())
  const localFiles = ref<Array<FileModel | IFile>>([])
  const injectedFiles = inject(
    filesKey,
    ref({}) as Ref<{ [COMPONENT_ID: string]: Array<FileModel | IFile> }>,
  )

  const files = computed({
    get() {
      return localFiles.value
    },
    set(files) {
      localFiles.value = files
      injectedFiles.value[componentName] = files
    },
  })

  const allFiles = computed(() => {
    return Object.values(injectedFiles.value).flat()
  })

  provide(filesKey, injectedFiles)

  function clearFiles() {
    localFiles.value.forEach(file => {
      if (file instanceof FileModel && file.isUploaded) {
        file.delete(handleRequest)
      }
    })
  }

  // Lifecycle
  onUnmounted(() => {
    delete injectedFiles.value[componentName]
  })

  return {
    files,
    allFiles,
    injectedFiles,
    clearFiles,
  }
}
