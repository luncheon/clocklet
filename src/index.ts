import adjustOnArrowKeys  from 'lenientime/es/input-helpers/adjust-on-arrow-keys'
import complete           from 'lenientime/es/input-helpers/complete'

import Clocklet           from './clocklet'
import template           from './template.pug'

{
  const lenientimeOptions = { dataAttributeName: 'clocklet' }
  complete(lenientimeOptions)
  adjustOnArrowKeys(lenientimeOptions)
}

document.body.innerHTML += template

const clocklet = new Clocklet(document.body.getElementsByClassName('clocklet')[0] as HTMLElement)

addEventListener('focus', event => {
  const target = event.target as HTMLInputElement
  if (target.tagName === 'INPUT' && !target.readOnly && !target.disabled && 'clocklet' in target.dataset) {
    clocklet.open(target)
  }
}, true)

addEventListener('blur', event => clocklet.close(), true)

export default clocklet
