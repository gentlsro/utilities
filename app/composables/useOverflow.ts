export function getScrollbarWidth() {
  if (!import.meta.client) {
    return 0
  }

  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear

  // @ts-expect-error Typing - CSS property
  outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

  // Removing temporary elements from the DOM
  outer.parentNode!.removeChild(outer)

  return scrollbarWidth
}

export type IOverflowOptions = {
  direction?: 'any' | 'horizontal' | 'vertical'
  returnDiff?: boolean
  threshold?: MaybeRefOrGetter<number>
}

export function useOverflow() {
  const scrollbarWidth = getScrollbarWidth()

  const isOverflown = (
    { clientWidth, clientHeight, scrollWidth, scrollHeight }: Element,
    options?: IOverflowOptions,
  ) => {
    const { direction = 'any', returnDiff, threshold = 0 } = options || {}
    const xDiff = scrollWidth - clientWidth
    const yDiff = scrollHeight - clientHeight

    const _threshold = toValue(threshold)

    switch (direction) {
      case 'any':
        return returnDiff ? { xDiff, yDiff } : xDiff > _threshold || yDiff > _threshold
      case 'horizontal':
        return returnDiff ? { xDiff } : xDiff > _threshold
      case 'vertical':
        return returnDiff ? { yDiff } : yDiff > _threshold
    }
  }

  const onOverflow = (
    elRef: MaybeRefOrGetter<Element | null | undefined>,
    handler: (value: boolean | { xDiff?: number, yDiff?: number }) => void,
    options?: IOverflowOptions,
  ) => {
    // Each registration owns its cache; equal results on separate elements
    // must still notify both handlers.
    let previousState: ReturnType<typeof isOverflown> | undefined
    let disposed = false

    watch(() => import.meta.client ? toValue(elRef) : null, (element, _, onCleanup) => {
      previousState = undefined

      if (!import.meta.client || !element) {
        return
      }

      const observer = new ResizeObserver(() => {
        if (disposed || !element.isConnected || toValue(elRef) !== element) {
          return
        }

        const value = isOverflown(element, options)

        if (!isEqual(value, previousState)) {
          previousState = value
          handler(value)
        }
      })

      observer.observe(element)
      onCleanup(() => observer.disconnect())
    }, { immediate: true, flush: 'post' })

    onScopeDispose(() => {
      disposed = true
    })

    // Explicit refresh always notifies, even if the overflow state is unchanged.
    // Resolve the target after DOM updates, not when the refresh was requested.
    return async () => {
      await nextTick()

      if (!import.meta.client || disposed) {
        return
      }

      const element = toValue(elRef)

      if (!element?.isConnected) {
        return
      }

      const value = isOverflown(element, options)
      previousState = value
      handler(value)
    }
  }

  return {
    scrollbarWidth,
    isOverflown,
    onOverflow,
  }
}
