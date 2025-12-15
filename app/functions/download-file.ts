// Types
import type { IFile } from '../../shared/types/file.type'

export async function handleDownloadFile(
  file: Pick<IFile, 'path' | 'name'>,
  options?: {
    /**
     * When true, the file will be opened in a new tab (instead of directly downloading it)
     */
    open?: boolean

    /**
     * When true, the function will only return the file URL
     */
    returnUrlOnly?: boolean

    /**
     * When provided, the function will use this URL instead of creating one
     * from the file path
     */
    url?: string | ((file: IFile) => string)
  },
) {
  const { returnUrlOnly, url: _url, open } = options || {}
  const rC = useRuntimeConfig()

  if (!('path' in file)) {
    return
  }

  let url = _url
    ? typeof _url === 'function' ? _url(file) : _url
    : `${rC.public.FILES_HOST}/${decodeURIComponent(file.path ?? '')}`

  // Make sure to remove double slashes
  url = url.replace('//', '/')

  if (returnUrlOnly) {
    return url
  }

  // Create a link element that downloads the file
  const link = document.createElement('a')

  if (!open) {
    link.download = file.name ?? ''
  }

  link.href = url
  link.target = '_blank'
  link.rel = 'noopener'
  link.classList.add('download-link')

  // Append the link to the body
  document.body.appendChild(link)
  link.click()

  // Cleanup the DOM
  link.remove()
}
