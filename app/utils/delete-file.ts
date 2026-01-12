// Models
import type { FileModel } from '../models/file.model'

export function deleteFile(payload: {
  file: FileModel
}) {
  const { file } = payload

  const rC = useRuntimeConfig()
  const filesHost = rC.public.filesHost

  // Delete the file
  console.log('deleteFile', file)
}
