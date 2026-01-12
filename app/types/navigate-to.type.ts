export type OpenWindowFeatures = {
  popup?: boolean
  noopener?: boolean
  noreferrer?: boolean
} & XOR<{
  width?: number
}, {
  innerWidth?: number
}> & XOR<{
  height?: number
}, {
  innerHeight?: number
}> & XOR<{
  left?: number
}, {
  screenX?: number
}> & XOR<{
  top?: number
}, {
  screenY?: number
}>

type OpenOptions = {
  target: '_blank' | '_parent' | '_self' | '_top' | (string & {})
  windowFeatures?: OpenWindowFeatures
}

export type NavigateToOptions = {
  replace?: boolean
  redirectCode?: number
  external?: boolean
  open?: OpenOptions
}
