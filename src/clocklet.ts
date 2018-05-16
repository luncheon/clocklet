import lenientime     from 'lenientime/es/core'
import ClockletDial   from './dial'
import isTouchDevice  from './is-touch-device'

export default class Clocklet {
  plate   = this.root.firstElementChild as HTMLElement
  hour    = new ClockletDial(
    this.plate.getElementsByClassName('clocklet-dial--hour')[0] as HTMLElement,
    12,
    value => this.value({ h: value }),
    () => this.root.classList.add('clocklet--dragging'),
    () => this.root.classList.remove('clocklet--dragging'),
  )
  minute  = new ClockletDial(
    this.plate.getElementsByClassName('clocklet-dial--minute')[0] as HTMLElement,
    60,
    value => this.value({ m: value }),
    () => this.root.classList.add('clocklet--dragging'),
    () => this.root.classList.remove('clocklet--dragging'),
  )
  ampm    = this.plate.getElementsByClassName('clocklet-ampm')[0] as HTMLElement
  input: HTMLInputElement | undefined

  constructor(public root: HTMLElement) {
    addEventListener('input', event => event.target === this.input && this.updateHighlight(), true)
    root.addEventListener('mousedown', event => event.preventDefault())
    this.ampm.addEventListener('mousedown', () => this.value({ a: this.ampm.dataset.clockletAmpm === 'pm' ? 'am' : 'pm' }))
  }

  public open(input: HTMLInputElement) {
    const inputRect                 = input.getBoundingClientRect()
    this.root.style.left = document.documentElement.scrollLeft + document.body.scrollLeft + inputRect.left   + 'px'
    this.root.style.top  = document.documentElement.scrollTop  + document.body.scrollTop  + inputRect.bottom + 'px'
    this.root.classList.add('clocklet--shown')
    this.input = input
    this.updateHighlight()
  }

  public close() {
    this.input = undefined
    this.root.classList.remove('clocklet--shown')
  }

  private value(time: { h?: number | string, m?: number | string, a?: 'am' | 'pm' }) {
    if (!this.input) {
      return
    }
    if (time.a === undefined) {
      time = { h: time.h, m: time.m, a: this.ampm.dataset.clockletAmpm as 'am' | 'pm' }
    }
    this.input.value = lenientime(this.input.value).with(time).format(this.input.dataset.clockletFormat || 'HH:mm')
    if (!isTouchDevice && this.input.type === 'text') {
      if (time.h !== undefined) {
        this.input.setSelectionRange(0, 2)
      } else if (time.m !== undefined) {
        this.input.setSelectionRange(3, 5)
      }
    }
    const inputEvent = document.createEvent('CustomEvent')
    inputEvent.initCustomEvent('input', true, false, 'clocklet')
    this.input.dispatchEvent(inputEvent)
  }

  private updateHighlight() {
    if (!this.input) {
      return
    }
    if (this.input.value) {
      const time = lenientime(this.input.value)
      this.root.dataset.value = time.HHmm
      this.hour.value(time.hour % 12)
      this.minute.value(time.minute)
      this.ampm.dataset.clockletAmpm = time.a
    } else {
      this.root.dataset.value = ''
      this.hour.value(-1)
      this.minute.value(-1)
      this.ampm.dataset.clockletAmpm = 'am'
    }
  }
}
