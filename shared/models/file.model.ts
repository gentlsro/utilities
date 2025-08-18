import axios, { type AxiosRequestHeaders, type RawAxiosRequestHeaders } from 'axios'
import type { Required } from 'utility-types'

export class FileModel {
  file: File
  uploadProgress: number
  hasError = false

  /**
   * A function that is called when the file is uploaded
   */
  onUploadCompleteQueue?: Array<(res: any) => void | Promise<void>> = []

  uploadedFile?: {
    filepath: string
    newFilename: string
    originalFilename: string
    mimetype: string
    size: number
  }

  abortController?: AbortController

  customData?: IItem

  get name() {
    return this.file.name
  }

  get type() {
    return this.file.type
  }

  get isUploading() {
    return this.uploadProgress > 0 && this.uploadProgress < 100
  }

  get isUploaded() {
    return this.uploadProgress === 100
  }

  get path() {
    return this.uploadedFile?.filepath
  }

  async upload(
    requestHandler: any,
    options?: {
      onComplete?: (model: any) => void
      onError?: (error: any) => void
      headers?: RawAxiosRequestHeaders
      notifyError?: boolean
      $z?: any
    },
  ) {
    const { onComplete, onError, notifyError, $z, headers } = options ?? {}

    if (this.uploadProgress === 100 && !this.hasError) {
      return
    }

    this.abortController = new AbortController()
    const filesHost = (useRuntimeConfig().public.FILES_HOST ?? '/api/files') as string
    const formData = new FormData()
    formData.append('files', this.file)
    this.hasError = false

    const { data } = await requestHandler(
      () =>
        axios.post(filesHost, formData, {
          headers,
          onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent

            if (!this.isUploaded) {
              this.uploadProgress = Math.min(
                Math.round((loaded / (total || 1)) * 100),
                99,
              )
            }
          },
          signal: this.abortController?.signal,
        }),
      {
        $z,
        onComplete: () => {
          this.uploadProgress = 100

          onComplete?.(this)
        },
        onError: (error: any) => {
          this.hasError = true
          onError?.(error)
        },
        notifyError,
        logging: { operationName: 'file.upload' },
      },
    )

    const file = data?.[0]
    this.uploadedFile = file
    this.onUploadCompleteQueue?.forEach(fn => fn(file))

    return data
  }

  async delete(
    requestHandler: any,
    options?: {
      ignoreWhenFoundInDb?: boolean
      onError?: (error: any) => void
      notifyError?: boolean
    },
  ) {
    const { onError, notifyError, ignoreWhenFoundInDb = true } = options ?? {}
    if (!this.uploadedFile) {
      return
    }

    const filesHost = (useRuntimeConfig().public.FILES_HOST ?? '/api/files') as string

    await requestHandler(
      () => $fetch(filesHost, {
        method: 'DELETE',
        body: { path: this.uploadedFile?.filepath, ignoreWhenFoundInDb },
      }),
      {
        onError,
        notifyError,
        logging: { operationName: 'file.delete' },
      },
    )
  }

  async cancelUpload() {
    this.abortController?.abort()
    this.uploadProgress = 0
    this.uploadedFile = undefined
  }

  constructor(obj: Required<Partial<FileModel>, 'file'>) {
    this.file = obj.file
    this.uploadProgress = 0
    this.customData = obj.customData
    this.onUploadCompleteQueue = obj.onUploadCompleteQueue
  }
}
