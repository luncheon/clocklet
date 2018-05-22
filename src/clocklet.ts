import lenientime from 'lenientime/es/core'
import Lenientime from 'lenientime/es/core/lenientime'
import { tokenizeTemplate } from 'lenientime/es/core/token'
import isTouchDevice from './is-touch-device'
import ClockletDial from './dial'
import { ClockletOptions, mergeDefaultOptions }  from './options'

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

  public open(input: HTMLInputElement, options?: Partial<ClockletOptions>) {
    const mergedOptions             = mergeDefaultOptions(options)
    const inputRect                 = input.getBoundingClientRect()
    const root                      = this.root
    root.className                  = 'clocklet ' + mergedOptions.className
    root.dataset.clockletPlacement  = mergedOptions.placement
    root.dataset.clockletAlignment  = mergedOptions.alignment
    root.dataset.clockletFormat     = mergedOptions.format
    root.style.left                 = document.documentElement.scrollLeft + document.body.scrollLeft + inputRect.left   - (mergedOptions.alignment === 'right'  ? root.offsetWidth  - inputRect.width : 0) + 'px'
    root.style.top                  = document.documentElement.scrollTop  + document.body.scrollTop  + inputRect.bottom - (mergedOptions.placement === 'top'    ? root.offsetHeight + inputRect.height + 1 : 0) + 'px'
    root.style.zIndex               = mergedOptions.zIndex !== '' ? mergedOptions.zIndex as string : (parseInt(getComputedStyle(input).zIndex!, 10) || 0) + 1 as any as string
    root.classList.add('clocklet--shown')
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
    const _time = lenientime(this.input.value).with(time.a !== undefined ? time : { h: time.h, m: time.m, a: this.ampm.dataset.clockletAmpm as 'am' | 'pm' })
    const template = this.root.dataset.clockletFormat || 'HH:mm'
    this.input.value = _time.format(template)
    if (!isTouchDevice && this.input.type === 'text') {
      const token =
        time.h !== undefined ? findHourToken(_time, template) :
        time.m !== undefined ? findMinuteToken(_time, template) :
        time.a !== undefined ? findAmpmToken(_time, template) || findHourToken(_time, template) :
        undefined
      token && this.input.setSelectionRange(token.index, token.index + token.value.length)
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
      this.root.dataset.clockletValue = time.HHmm
      this.hour.value(time.hour % 12)
      this.minute.value(time.minute)
      this.ampm.dataset.clockletAmpm = time.a
    } else {
      this.root.dataset.clockletValue = ''
      this.hour.value(-1)
      this.minute.value(-1)
      this.ampm.dataset.clockletAmpm = 'am'
    }
  }
}

function findHourToken(time: Lenientime, template: string) {
  return findToken(time, template, /[Hhk]$/)
}

function findMinuteToken(time: Lenientime, template: string) {
  return findToken(time, template, /m$/)
}

function findAmpmToken(time: Lenientime, template: string) {
  return findToken(time, template, /a/i)
}

function findToken(time: Lenientime, template: string, pattern: RegExp) {
  let index = 0
  for (const token of tokenizeTemplate(template)) {
    if (token.literal) {
      index += token.property.length
    } else {
      const value = time[token.property as keyof Lenientime]
      if (pattern.test(token.property)) {
        return { index, value }
      } else {
        index += value.length;
      }
    }
  }
  return
}
