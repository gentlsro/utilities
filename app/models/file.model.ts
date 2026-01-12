import type { Required } from 'utility-types'
import { utilsConfig } from '$utilsConfig'

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

  async upload(payload: {
    additionalData?: IItem
    requestHandler?: any
    onComplete?: (res: any) => void
    onError?: (error: any) => void
  }) {
    const { additionalData, requestHandler, onComplete, onError } = payload ?? {}

    return utilsConfig.files.uploadHandler({
      file: this,
      additionalData,
      requestHandler,
      onComplete,
      onError,
    })
  }

  async delete(payload?: {
    additionalData?: IItem
    requestHandler?: any
    onComplete?: (res: any) => void
    onError?: (error: any) => void
  }) {
    const { additionalData, requestHandler, onComplete, onError } = payload ?? {}
    if (!this.uploadedFile) {
      return
    }

    return utilsConfig.files.deleteHandler({
      file: this,
      additionalData,
      requestHandler,
      onComplete,
      onError,
    })
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
