export function dispatchCustomEvent(target: EventTarget, type: string, bubbles: boolean, cancelable: boolean, detail?: any) {
  const event = document.createEvent('CustomEvent')
  event.initCustomEvent(type, bubbles, cancelable, detail)
  target.dispatchEvent(event)
  return event
}
