import lenientime     from 'lenientime/es/core'
import ClockletDial   from './dial'
import isTouchDevice  from './is-touch-device'

export default class Clocklet {
  plate   = this.root.firstElementChild as HTMLElement
  hour    = new ClockletDial(this.plate.getElementsByClassName('clocklet__dial-hour')[0] as HTMLElement,   12, value => this.value({ h: value }))
  minute  = new ClockletDial(this.plate.getElementsByClassName('clocklet__dial-minute')[0] as HTMLElement, 60, value => this.value({ m: value }))
  ampm    = this.plate.getElementsByClassName('clocklet__toggle-am-pm')[0] as HTMLElement
  input: HTMLInputElement | undefined

  constructor(public root: HTMLElement) {
    addEventListener('input', event => event.target === this.input && this.updateHighlight(), true)
    root.addEventListener('mousedown', event => event.preventDefault())
    if (isTouchDevice) {
      this.plate.addEventListener('touchstart', this.onDragStart.bind(this))
      this.plate.addEventListener('touchend',   this.onDragEnd.bind(this))
    } else {
      this.plate.addEventListener('mousedown',  this.onDragStart.bind(this))
      addEventListener('mouseup',               this.onDragEnd.bind(this), true)
    }
  }

  public open(input: HTMLInputElement) {
    const inputRect                 = input.getBoundingClientRect()
    this.root.style.left = document.documentElement.scrollLeft + document.body.scrollLeft + inputRect.left   + 'px'
    this.root.style.top  = document.documentElement.scrollTop  + document.body.scrollTop  + inputRect.bottom + 'px'
    this.root.classList.add('clocklet_shown')
    this.input = input
    this.updateHighlight()
  }

  public close() {
    this.input = undefined
    this.root.classList.remove('clocklet_shown')
  }

  private value(time: { h?: number | string, m?: number | string, a?: 'am' | 'pm' }) {
    if (!this.input) {
      return
    }
    if (time.a === undefined) {
      time = { h: time.h, m: time.m, a: this.ampm.dataset.clockletAmPm as 'am' | 'pm' }
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
    const time = lenientime(this.input.value)
    this.root.dataset.value = this.input.value && time.HHmm
    this.hour.value(time.hour % 12)
    this.minute.value(time.minute)
    this.ampm.dataset.clockletAmPm = time.a
  }

  private onDragStart(event: Event) {
    if (!this.input) {
      return
    }
    const target = event.target as HTMLElement
    if (this.ampm.contains(target)) {
      this.value({ a: this.ampm.dataset.clockletAmPm === 'pm' ? 'am' : 'pm' })
    } else if (this.hour.contains(target)) {
      this.root.dataset.clockletDragging = 'hour'
    } else if (this.minute.contains(target)) {
      this.root.dataset.clockletDragging = 'minute'
    }
  }

  private onDragEnd() {
    delete this.root.dataset.clockletDragging
  }
}
