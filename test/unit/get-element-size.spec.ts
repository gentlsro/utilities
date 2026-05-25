// @vitest-environment happy-dom

import { getElementSize } from '../../app/functions/get-element-size'

function createSizedElement(width: number, height: number, margin: string) {
  const element = document.createElement('div')
  element.style.width = `${width}px`
  element.style.height = `${height}px`
  element.style.margin = margin
  Object.defineProperty(element, 'offsetWidth', { value: width })
  Object.defineProperty(element, 'offsetHeight', { value: height })
  document.body.appendChild(element)

  return element
}

describe('getElementSize', () => {
  it('returns element dimensions without margin when includeMargin is false', () => {
    const element = createSizedElement(100, 50, '10px')

    const size = getElementSize(element, { includeMargin: false })

    expect(size.total.width).toBe(100)
    expect(size.total.height).toBe(50)
    expect(size.margin.horizontal).toBe(20)
    expect(size.margin.vertical).toBe(20)
  })

  it('includes margin in total size by default', () => {
    const element = createSizedElement(100, 50, '10px')

    const size = getElementSize(element)

    expect(size.total.width).toBe(120)
    expect(size.total.height).toBe(70)
  })
})
