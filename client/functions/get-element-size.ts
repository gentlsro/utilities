export function getElementSize(el: HTMLElement, options?: { includeMargin?: boolean, includeBorder?: boolean, includePadding?: boolean }) {
  const {
    includeMargin = true,
    includeBorder = false,
    includePadding = false,
  } = options ?? {}

  const cs = window.getComputedStyle(el)
  const height = el.offsetHeight
  const width = el.offsetWidth

  // Margin
  const marginTop = Number.parseFloat(cs.marginTop)
  const marginBottom = Number.parseFloat(cs.marginBottom)
  const marginLeft = Number.parseFloat(cs.marginLeft)
  const marginRight = Number.parseFloat(cs.marginRight)

  const marginHorizontal = includeMargin ? marginLeft + marginRight : 0
  const marginVertical = includeMargin ? marginTop + marginBottom : 0

  // Border
  const borderTop = Number.parseFloat(cs.borderTopWidth)
  const borderBottom = Number.parseFloat(cs.borderBottomWidth)
  const borderLeft = Number.parseFloat(cs.borderLeftWidth)
  const borderRight = Number.parseFloat(cs.borderRightWidth)

  const borderHorizontal = includeBorder ? borderLeft + borderRight : 0
  const borderVertical = includeBorder ? borderTop + borderBottom : 0

  // Padding
  const paddingTop = Number.parseFloat(cs.paddingTop)
  const paddingBottom = Number.parseFloat(cs.paddingBottom)
  const paddingLeft = Number.parseFloat(cs.paddingLeft)
  const paddingRight = Number.parseFloat(cs.paddingRight)

  const paddingHorizontal = includePadding ? paddingLeft + paddingRight : 0
  const paddingVertical = includePadding ? paddingTop + paddingBottom : 0

  return {
    total: {
      height: height + marginVertical + borderVertical + paddingVertical,
      width: width + marginHorizontal + borderHorizontal + paddingHorizontal,
    },
    margin: {
      horizontal: marginLeft + marginRight,
      vertical: marginTop + marginBottom,
    },
    border: {
      horizontal: borderLeft + borderRight,
      vertical: borderTop + borderBottom,
    },
    padding: {
      horizontal: paddingLeft + paddingRight,
      vertical: paddingTop + paddingBottom,
    },
    extra: {
      horizontal: marginHorizontal + borderHorizontal + paddingHorizontal,
      vertical: marginVertical + borderVertical + paddingVertical,
    },
  }
}
