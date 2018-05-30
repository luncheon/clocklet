import adjustOnArrowKeys  from 'lenientime/es/input-helpers/adjust-on-arrow-keys'
import complete           from 'lenientime/es/input-helpers/complete'

import Clocklet           from './clocklet'
import { parseOptions, ClockletOptions }  from './options'

{
  const lenientimeOptions = {
    dataAttributeName: 'clocklet',
    formatSelector: (input: HTMLInputElement) => {
      const options = parseOptions(input.dataset.clocklet)
      return options && options.format
    }
  }
  complete(lenientimeOptions)
  adjustOnArrowKeys(lenientimeOptions)
}

function clocklet(options: Partial<ClockletOptions> & {
  appendTo?:        HTMLElement
  target?:          HTMLInputElement | string | ((element: Element) => boolean)
  optionsSelector?: (target: HTMLInputElement) => Partial<Readonly<ClockletOptions>> | undefined
} = {}) {
  const instance = new Clocklet(options)
  ;(options.appendTo || document.body).appendChild(instance.root)

  const target = options.target || 'input[data-clocklet]:enabled:not([readonly])'
  const optionsSelector = options.optionsSelector || (target => parseOptions(target.dataset.clocklet))
  const close = instance.close.bind(instance)

  if (target instanceof Element) {
    target.addEventListener('focus', event => instance.open(event.target as HTMLInputElement, optionsSelector(event.target as HTMLInputElement)))
    target.addEventListener('blur', close)
  } else {
    const isTarget = typeof target === 'function' ? target : (element: Element) => (Element.prototype.matches || Element.prototype.msMatchesSelector).call(element, target) as boolean
    document.body.addEventListener('focus', event => {
      const element = event.target as HTMLInputElement
      isTarget(element) && instance.open(element, optionsSelector(element))
    }, true)
    document.body.addEventListener('blur', close, true)
  }
  return instance
}

export default clocklet()
