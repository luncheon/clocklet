import { __assign } from 'tslib'
import lenientime from 'lenientime/es/core'
import Lenientime from 'lenientime/es/core/lenientime'
import { tokenizeTemplate } from 'lenientime/es/core/token'
import isTouchDevice from './is-touch-device'
import ClockletDial from './dial'
import { ClockletOptions, defaultDefaultOptions }  from './options'
import template from './template.pug'
import { dispatchCustomEvent } from './event';

export default class ClockletClock {
  container = createClockletElements()
  root      = this.container.firstElementChild as HTMLElement
  plate     = this.root.firstElementChild as HTMLElement
  hour      = new ClockletDial(this.plate.getElementsByClassName('clocklet-dial--hour')[0]   as HTMLElement, 12, value => this.value({ h: value }))
  minute    = new ClockletDial(this.plate.getElementsByClassName('clocklet-dial--minute')[0] as HTMLElement, 60, value => this.value({ m: value }))
  ampm      = this.plate.getElementsByClassName('clocklet-ampm')[0] as HTMLElement
  defaultOptions: ClockletOptions
  input: HTMLInputElement | undefined
  dispatchesInputEvents: boolean | undefined

  constructor(options?: Partial<Readonly<ClockletOptions>>) {
    this.defaultOptions = __assign(Object.create(defaultDefaultOptions), options)
    addEventListener('input', event => event.target === this.input && this.updateHighlight(), true)
    this.root.addEventListener('mousedown', event => event.preventDefault())
    this.ampm.addEventListener('mousedown', () => this.value({ a: this.ampm.dataset.clockletAmpm === 'pm' ? 'am' : 'pm' }))
    this.root.addEventListener('clocklet.dragstart', () => this.root.classList.add('clocklet--dragging'))
    this.root.addEventListener('clocklet.dragend', () => this.root.classList.remove('clocklet--dragging'))
  }

  public open(input: HTMLInputElement, options?: Partial<Readonly<ClockletOptions>>) {
    this._open(input, options, true)
  }

  public openWithoutEvents(input: HTMLInputElement, options?: Partial<Readonly<ClockletOptions>>) {
    this._open(input, options, false)
  }

  private _open(input: HTMLInputElement, options: Partial<ClockletOptions> | undefined, withEvents: boolean) {
    const resolvedOptions           = __assign(Object.create(this.defaultOptions), options) as ClockletOptions
    const inputRect                 = input.getBoundingClientRect()
    const { container, root }           = this
    const eventDetail               = { options: resolvedOptions }
    if (withEvents && dispatchCustomEvent(input, 'clocklet.opening', true, true, eventDetail).defaultPrevented) {
      return
    }
    this.input = input
    this.updateHighlight()
    this.dispatchesInputEvents      = resolvedOptions.dispatchesInputEvents

    root.dataset.clockletPlacement  = resolvedOptions.placement
    root.dataset.clockletAlignment  = resolvedOptions.alignment
    root.dataset.clockletFormat     = resolvedOptions.format
    root.dataset.clockletAppendTo   = resolvedOptions.appendTo
    root.className                  = 'clocklet ' + (isTouchDevice ? '' : 'clocklet--hoverable ') + resolvedOptions.className
    if (resolvedOptions.placement === 'top') {
      root.style.top    = ''
      root.style.bottom = '0'
    } else {
      root.style.top    = `${inputRect.height}px`
      root.style.bottom = ''
    }
    if (resolvedOptions.alignment === 'right') {
      root.style.left   = ''
      root.style.right  = `-${inputRect.width}px`
    } else {
      root.style.left   = '0'
      root.style.right  = ''
    }

    container.style.zIndex = resolvedOptions.zIndex !== '' ? resolvedOptions.zIndex as string : (parseInt(getComputedStyle(input).zIndex!, 10) || 0) + 1 as any as string
    if (resolvedOptions.appendTo === 'parent') {
      container.style.position  = 'relative'
      container.style.left      = '0'
      container.style.top       = '0'
      input.parentElement!.insertBefore(container, input)
    } else {
      container.style.position  = 'absolute'
      container.style.left      = document.documentElement.scrollLeft + document.body.scrollLeft + inputRect.left + 'px'
      container.style.top       = document.documentElement.scrollTop  + document.body.scrollTop  + inputRect.top  + 'px'
      if (container.parentElement !== document.body) {
        document.body.appendChild(container)
      }
    }
    setTimeout(() => root.classList.add('clocklet--shown'))
    withEvents && dispatchCustomEvent(input, 'clocklet.opened', true, false, eventDetail)
  }

  public close() {
    const input = this.input
    const eventDetail = {}
    if (!input) {
      return
    }
    if (dispatchCustomEvent(input, 'clocklet.closing', true, true, eventDetail).defaultPrevented) {
      input.focus()
      return
    }
    this.input = undefined
    this.root.classList.remove('clocklet--shown')
    dispatchCustomEvent(input, 'clocklet.closed', true, false, eventDetail)
  }

  private value(time: { h?: number | string, m?: number | string, a?: 'am' | 'pm' }) {
    if (!this.input) {
      return
    }
    if (time.a === undefined) {
      time = { h: time.h, m: time.m, a: this.ampm.dataset.clockletAmpm as 'am' | 'pm' }
    }
    const oldValue = this.input.value
    const _time = lenientime(this.input.value).with(time.a !== undefined ? time : { h: time.h, m: time.m, a: this.ampm.dataset.clockletAmpm as 'am' | 'pm' })
    const template = this.root.dataset.clockletFormat || 'HH:mm'
    this.input.value = _time.format(template)
    if (this.input.type === 'text') {
      const token =
        time.h !== undefined ? findHourToken(_time, template) :
        time.m !== undefined ? findMinuteToken(_time, template) :
        time.a !== undefined ? findAmpmToken(_time, template) || findHourToken(_time, template) :
        undefined
      token && this.input.setSelectionRange(token.index, token.index + token.value.length)
    }
    this.dispatchesInputEvents && this.input.value !== oldValue && dispatchCustomEvent(this.input, 'input', true, false, undefined)
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

function createClockletElements() {
  const element = document.createElement('div')
  element.className = 'clocklet-container'
  element.innerHTML = template
  return element
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
