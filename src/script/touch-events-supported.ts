let touchEventsSupported: boolean
if (window.ontouchend === undefined) {
  touchEventsSupported = false
} else {
  const _ontouchend = window.ontouchend
  window.ontouchend = undefined as any
  touchEventsSupported = window.ontouchend !== undefined
  window.ontouchend = _ontouchend
}
export default touchEventsSupported
