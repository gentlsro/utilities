import axios from 'axios'

// Models
import type { FileModel } from '../models/file.model'

export function uploadFile(payload: {
  file: FileModel
}) {
  const { file } = payload

  const rC = useRuntimeConfig()
  const filesHost = rC.public.filesHost

  file.abortController = new AbortController()

  // Create form data
  const formData = new FormData()
  formData.append('files', payload.file.file)

  return axios.post(filesHost, formData, {
    onUploadProgress: progressEvent => {
      const { loaded, total } = progressEvent

      if (!file.isUploaded) {
        file.uploadProgress = Math.min(
          Math.round((loaded / (total || 1)) * 100),
          99,
        )
      }
    },
    signal: file.abortController?.signal,
  })
}
