export type UseHoverTextScrollOptions = {
  /** 'pingpong' loops back and forth; 'once' scrolls to end then stops */
  mode?: 'pingpong' | 'once'

  /** Pause at each end of a ping-pong leg (ms) */
  pauseMs?: number

  /** Scroll speed in pixels per second */
  speedPxPerSec?: number

  /** Speed when scrolling back to the start after hover ends (px/s). Default 180. */
  returnSpeedPxPerSec?: number

  /** When true, animation is skipped for users who prefer reduced motion */
  respectReducedMotion?: boolean
}

// -- Module-level singletons (shared across all instances) --------------------

const SCROLLBAR_HIDE_ATTR = 'data-hover-text-scroll'

let styleInjected = false
function injectScrollbarHideStyle() {
  if (styleInjected || !import.meta.client) {
    return
  }

  const style = document.createElement('style')
  style.textContent = `[${SCROLLBAR_HIDE_ATTR}]{scrollbar-width:none}[${SCROLLBAR_HIDE_ATTR}]::-webkit-scrollbar{display:none}`
  document.head.appendChild(style)
  styleInjected = true
}

// One query serves the active text controls and stops with its last owner.
const getSharedReducedMotion = createSharedComposable(() => useMediaQuery('(prefers-reduced-motion: reduce)'))

// -- Composable ---------------------------------------------------------------

/**
 * On hover, smoothly scrolls a truncated text element so the full content is
 * revealed. Observers (ResizeObserver, MutationObserver) are only active
 * **while** the element is hovered to keep idle cost minimal.
 *
 * `isOverflowing` stays `false` until the first hover measures the element.
 */
export function useHoverTextScroll(
  elRef: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options?: UseHoverTextScrollOptions,
) {
  const {
    mode = 'pingpong',
    pauseMs = 600,
    speedPxPerSec = 60,
    returnSpeedPxPerSec = 180,
    respectReducedMotion = true,
  } = options ?? {}

  const isOverflowing = ref(false)

  if (!import.meta.client) {
    return { isOverflowing: readonly(isOverflowing) }
  }

  injectScrollbarHideStyle()

  const prefersReducedMotion = respectReducedMotion
    ? getSharedReducedMotion()
    : ref(false)

  let rafId: number | null = null
  let pauseTimer: ReturnType<typeof setTimeout> | null = null
  let resizeObs: ResizeObserver | null = null
  let mutationObs: MutationObserver | null = null
  let activeElement: HTMLElement | null = null

  function getEl(): HTMLElement | null {
    return toValue(elRef) as HTMLElement | null
  }

  function getMaxScroll(el: HTMLElement) {
    return el.scrollWidth - el.clientWidth
  }

  function checkOverflow() {
    const el = getEl()
    if (!el) {
      isOverflowing.value = false

      return
    }

    isOverflowing.value = el.scrollWidth > el.clientWidth
  }

  // -- Lazy observers: only while hovered ------------------------------------

  function attachHoverObservers(el: HTMLElement) {
    if (!resizeObs) {
      resizeObs = new ResizeObserver(() => checkOverflow())
    }

    if (!mutationObs) {
      mutationObs = new MutationObserver(() => checkOverflow())
    }

    resizeObs.observe(el)
    mutationObs.observe(el, { subtree: true, characterData: true, childList: true })
  }

  function detachHoverObservers() {
    resizeObs?.disconnect()
    mutationObs?.disconnect()
  }

  // -- Style helpers ----------------------------------------------------------

  function applyScrollStyles(el: HTMLElement) {
    el.style.overflowX = 'auto'
    el.style.textOverflow = 'clip'
    el.setAttribute(SCROLLBAR_HIDE_ATTR, '')
  }

  function removeScrollStyles(el: HTMLElement) {
    el.style.removeProperty('overflow-x')
    el.style.removeProperty('text-overflow')
    el.removeAttribute(SCROLLBAR_HIDE_ATTR)
  }

  function releaseTarget(el: HTMLElement | null) {
    cancelAnimation()
    detachHoverObservers()
    if (el) {
      el.scrollLeft = 0
      removeScrollStyles(el)
    }
  }

  // -- Animation helpers ------------------------------------------------------

  function cancelAnimation() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    if (pauseTimer !== null) {
      clearTimeout(pauseTimer)
      pauseTimer = null
    }
  }

  function animateScroll(el: HTMLElement) {
    const maxScroll = getMaxScroll(el)

    if (maxScroll <= 0) {
      return
    }

    if (prefersReducedMotion.value) {
      el.scrollLeft = maxScroll

      return
    }

    let direction: 1 | -1 = 1
    let prevTimestamp: number | null = null
    let position = el.scrollLeft

    function step(timestamp: number) {
      if (prevTimestamp === null) {
        prevTimestamp = timestamp
      }

      const dt = (timestamp - prevTimestamp) / 1000
      prevTimestamp = timestamp

      const delta = speedPxPerSec * dt * direction
      // WebKit rounds DOM scroll offsets; retain fractional movement locally.
      position = Math.max(0, Math.min(maxScroll, position + delta))
      el.scrollLeft = position

      const atEnd = direction === 1 && position >= maxScroll
      const atStart = direction === -1 && position <= 0

      if (atEnd || atStart) {
        if (mode === 'once' && atEnd) {
          rafId = null

          return
        }

        prevTimestamp = null
        direction = direction === 1 ? -1 : 1

        pauseTimer = setTimeout(() => {
          pauseTimer = null
          rafId = requestAnimationFrame(step)
        }, pauseMs)

        return
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
  }

  function animateScrollBack(el: HTMLElement, onDone?: () => void) {
    if (el.scrollLeft <= 0 || prefersReducedMotion.value) {
      el.scrollLeft = 0
      onDone?.()

      return
    }

    let prevTimestamp: number | null = null
    let position = el.scrollLeft

    function step(timestamp: number) {
      if (prevTimestamp === null) {
        prevTimestamp = timestamp
      }

      const dt = (timestamp - prevTimestamp) / 1000
      prevTimestamp = timestamp

      position = Math.max(0, position - returnSpeedPxPerSec * dt)
      el.scrollLeft = position

      if (position <= 0) {
        rafId = null
        onDone?.()

        return
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
  }

  // -- Hover state machine ----------------------------------------------------

  function onHoverChange(hovered: boolean) {
    const el = getEl()
    if (!el) {
      releaseTarget(activeElement)
      activeElement = null

      return
    }

    activeElement = el
    cancelAnimation()

    if (hovered) {
      checkOverflow()

      if (!isOverflowing.value) {
        return
      }

      attachHoverObservers(el)
      applyScrollStyles(el)
      animateScroll(el)
    } else {
      detachHoverObservers()

      animateScrollBack(el, () => {
        removeScrollStyles(el)
        nextTick(checkOverflow)
      })
    }
  }

  const isHovered = useElementHover(computed(() => getEl()))

  watch(isHovered, onHoverChange)
  watch(getEl, (element, previous) => {
    if (previous && previous !== element) {
      releaseTarget(previous)
      isOverflowing.value = false
      isHovered.value = false
    }
    activeElement = element
  }, { flush: 'post' })

  tryOnScopeDispose(() => {
    releaseTarget(activeElement ?? getEl())
    activeElement = null
  })

  return { isOverflowing: readonly(isOverflowing) }
}
