import adjustOnArrowKeys from 'lenientime/es/input-helpers/adjust-on-arrow-keys'
import complete from 'lenientime/es/input-helpers/complete'
import lenientime from 'lenientime/es/core'
import div from './div'
import ClockletDial from './dial';

{
  const lenientimeOptions = { dataAttributeName: 'clocklet' }
  complete(lenientimeOptions)
  adjustOnArrowKeys(lenientimeOptions)
}

const isTouchDevice     = matchMedia('(hover: none)').matches
const clockletElement   = document.body.appendChild(div('clocklet'))
const plateElement      = clockletElement.appendChild(div('clocklet__plate'))
const dialMinute        = new ClockletDial(plateElement, 'minute', 60, m => m % 5 ? 46 : 39)
const dialHour          = new ClockletDial(plateElement, 'hour',   12, h => 42)
const toggleAmPmElement = plateElement.appendChild(div('clocklet__toggle-am-pm'))
let targetInputElement: HTMLInputElement | undefined
plateElement.appendChild(div('clocklet__hands-origin'))

addEventListener('focus', event => {
  const target = event.target as HTMLInputElement
  if (target.tagName !== 'INPUT' || target.readOnly || target.disabled || !('clocklet' in target.dataset)) {
    return
  }
  const targetRect            = target.getBoundingClientRect()
  clockletElement.style.left  = document.documentElement.scrollLeft + document.body.scrollLeft + targetRect.left   + 'px'
  clockletElement.style.top   = document.documentElement.scrollTop  + document.body.scrollTop  + targetRect.bottom + 'px'
  clockletElement.classList.add('clocklet_shown')
  targetInputElement = target
  updateHighlight()
}, true)

addEventListener('blur', event => {
  if (targetInputElement) {
    targetInputElement = undefined
    clockletElement.classList.remove('clocklet_shown')
  }
}, true)

addEventListener('input', event => targetInputElement === event.target && updateHighlight(), true)

{
  const clockletDataset = clockletElement.dataset
  const onDragEnd = () => delete clockletDataset.clockletDragging
  const onDragStart = (event: MouseEvent | TouchEvent) => {
    if (!targetInputElement) {
      return
    }
    if (event instanceof TouchEvent && event.touches.length > 1) {
      delete clockletDataset.clockletDragging
      return
    }
    const target = event.target as HTMLElement
    if (toggleAmPmElement.contains(target)) {
      setValue(targetInputElement, { a: toggleAmPmElement.dataset.clockletAmPm === 'pm' ? 'am' : 'pm' })
    } else {
      const tickValue = target.dataset.clockletTickValue
      const targetDialIsHour = dialHour.contains(target)
      tickValue && setValue(targetInputElement, targetDialIsHour ? { h: tickValue } : { m: tickValue })
      clockletDataset.clockletDragging = targetDialIsHour ? 'hour' : 'minute'
    }
    event.preventDefault()
  }
  const onDrag = (event: MouseEvent | TouchEvent) => {
    const dragging = clockletDataset.clockletDragging
    if (!targetInputElement || !dragging) {
      return
    }
    const coordinate = event instanceof TouchEvent ? event.targetTouches[0] : event
    const targetElement = document.elementFromPoint(coordinate.clientX, coordinate.clientY)
    const targetDataset = targetElement && (targetElement as HTMLElement).dataset
    const tickValue = targetDataset && targetDataset.clockletTickValue
    if (dragging === 'hour' && tickValue && targetElement.classList.contains('clocklet__tick-hour')) {
      setValue(targetInputElement, { h: tickValue })
    } else if (dragging === 'minute' && tickValue && targetElement.classList.contains('clocklet__tick-minute')) {
      setValue(targetInputElement, { m: tickValue })
    } else {
      const plateRect = plateElement.getBoundingClientRect()
      const x = coordinate.clientX - plateRect.left - plateRect.width / 2    // event x from the center of clocklet
      const y = coordinate.clientY - plateRect.top  - plateRect.height / 2
      const angle = Math.atan2(y, x)
      setValue(targetInputElement, dragging === 'hour' ? { h: Math.round(angle / Math.PI * 6 + 15) % 12 } : { m: Math.round(angle / Math.PI * 30 + 75) % 60 })
    }
    event.preventDefault()
  }

  clockletElement.addEventListener('mousedown', event => event.preventDefault())
  if (isTouchDevice) {
    plateElement.addEventListener('touchstart', onDragStart)
    plateElement.addEventListener('touchmove', onDrag)
    plateElement.addEventListener('touchend', onDragEnd)
  } else {
    plateElement.addEventListener('mousedown', onDragStart)
    addEventListener('mousemove', onDrag, true)
    addEventListener('mouseup', onDragEnd, true)
  }
}

function setValue(input: HTMLInputElement, time: { h?: number | string, m?: number | string, a?: 'am' | 'pm' }) {
  if (time.a === undefined) {
    time = { h: time.h, m: time.m, a: toggleAmPmElement.dataset.clockletAmPm as 'am' | 'pm' }
  }
  input.value = lenientime(input.value).with(time).format(input.dataset.clockletFormat || 'HH:mm')
  if (!isTouchDevice && input.type === 'text') {
    if (time.h !== undefined) {
      input.setSelectionRange(0, 2)
    } else if (time.m !== undefined) {
      input.setSelectionRange(3, 5)
    }
  }
  const inputEvent = document.createEvent('CustomEvent')
  inputEvent.initCustomEvent('input', true, false, 'clocklet')
  input.dispatchEvent(inputEvent)
}

function updateHighlight() {
  if (!targetInputElement) {
    return
  }
  clockletElement.dataset.value = targetInputElement.value
  const time = lenientime(targetInputElement.value)
  dialHour.value(time.hour % 12)
  dialMinute.value(time.minute)
  toggleAmPmElement.dataset.clockletAmPm = time.a
}
