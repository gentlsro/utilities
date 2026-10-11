/**
 * One shared pointer position in viewport (client) coordinates, the same space as `getBoundingClientRect` and
 * `elementsFromPoint`. VueUse defaults to page coordinates, which drift from every hit test as soon as the window
 * scrolls.
 */
export const useSharedMouse = createSharedComposable(() => useMouse({ type: 'client' }))
