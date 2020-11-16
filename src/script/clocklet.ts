import adjustOnArrowKeys from 'lenientime/es/input-helpers/adjust-on-arrow-keys'
import complete from 'lenientime/es/input-helpers/complete'

import ClockletClock from './clock'
import { parseOptions, ClockletOptions } from './options'

{
  const lenientimeOptions = {
    dataAttributeName: 'clocklet',
    formatSelector: (input: HTMLInputElement) => {
      const options = parseOptions(input.getAttribute('data-clocklet'))
      return options && options.format
    }
  }
  complete(lenientimeOptions)
  adjustOnArrowKeys(lenientimeOptions)
}

function clocklet(options: {
  target?:          HTMLInputElement | string | ((element: Element) => boolean)
  optionsSelector?: (target: HTMLInputElement) => Partial<Readonly<ClockletOptions>> | undefined
  defaultOptions?:  Partial<Readonly<ClockletOptions>>
} = {}) {
  const instance = new ClockletClock(options.defaultOptions)
  const target = options.target || 'input[data-clocklet]:not([data-clocklet-inline])'
  const optionsSelector = options.optionsSelector || (target => parseOptions(target.getAttribute('data-clocklet')))
  const close = instance.close.bind(instance)

  if (target instanceof Element) {
    target.addEventListener('focus', event => instance.open(event.target as HTMLInputElement, optionsSelector(event.target as HTMLInputElement)))
    target.addEventListener('blur', close)
  } else {
    const isTarget = typeof target === 'function' ? target : (element: Element) => (Element.prototype.matches || Element.prototype.msMatchesSelector).call(element, target) as boolean
    addEventListener('focusin', event => {
      const element = event.target as HTMLInputElement
      isTarget(element) && instance.open(element, optionsSelector(element))
    }, true)
    addEventListener('focusout', close, true)
  }
  return instance
}

export default clocklet()
