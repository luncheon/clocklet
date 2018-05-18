import adjustOnArrowKeys  from 'lenientime/es/input-helpers/adjust-on-arrow-keys'
import complete           from 'lenientime/es/input-helpers/complete'

import Clocklet           from './clocklet'
import { parseOptions }   from './options'
import template           from './template.pug'

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

document.body.innerHTML += template

const clocklet = new Clocklet(document.body.getElementsByClassName('clocklet')[0] as HTMLElement)

addEventListener('focus', event => {
  const target = event.target as HTMLInputElement
  if (target.tagName === 'INPUT' && !target.readOnly && !target.disabled && 'clocklet' in target.dataset) {
    clocklet.open(target, parseOptions(target.dataset.clocklet))
  }
}, true)

addEventListener('blur', event => clocklet.close(), true)

export default clocklet
