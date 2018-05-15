import isTouchDevice from './is-touch-device'

export default class ClockletDial {
  hand = this.dial.getElementsByClassName(`clocklet-dial__hand`)[0] as HTMLElement
  private dragging = false

  constructor(public dial: HTMLElement, private maxValue: number, private setValue: (value: string | number) => void) {
    if (isTouchDevice) {
      dial.addEventListener('touchstart', this.onDragStart.bind(this))
      dial.addEventListener('touchmove',  this.onDrag.bind(this))
      dial.addEventListener('touchend',   this.onDragEnd.bind(this))
    } else {
      dial.addEventListener('mousedown',  this.onDragStart.bind(this))
      addEventListener('mousemove',       this.onDrag.bind(this), true)
      addEventListener('mouseup',         this.onDragEnd.bind(this), true)
    }
  }

  public value(value: number) {
    this.hand.style.transform = `rotate(${value * 360 / this.maxValue}deg)`
    const selectedClassName   = `clocklet-dial__tick--selected`
    const previousSelected    = this.dial.getElementsByClassName(selectedClassName)[0]
    const currentSelected     = this.dial.querySelector(`[data-clocklet-tick-value="${value}"]`)
    if (previousSelected !== currentSelected) {
      previousSelected && previousSelected.classList.remove(selectedClassName)
      currentSelected  && currentSelected .classList.add(selectedClassName)
    }
  }

  public contains(element: HTMLElement) {
    return this.dial.contains(element)
  }

  private onDragStart(event: Event & Readonly<{ touches?: TouchList }>) {
    if (event.touches && event.touches.length > 1) {
      this.dragging = false
      return
    }
    this.dragging = true
    const tickValue = (event.target as HTMLElement).dataset.clockletTickValue
    tickValue && this.setValue(tickValue)
    event.preventDefault()
  }

  private onDrag(event: Event & Readonly<{ clientX: number, clientY: number, targetTouches?: TouchList }>) {
    if (!this.dragging) {
      return
    }
    const coordinate = event.targetTouches ? event.targetTouches[0] : event
    const targetElement = document.elementFromPoint(coordinate.clientX, coordinate.clientY)
    const targetDataset = targetElement && (targetElement as HTMLElement).dataset
    const tickValue = targetDataset && targetDataset.clockletTickValue
    if (tickValue && this.dial.contains(targetElement)) {
      this.setValue(tickValue)
    } else {
      const dialRect = this.dial.getBoundingClientRect()
      const x = coordinate.clientX - dialRect.left - dialRect.width / 2    // event x from the center of this dial
      const y = coordinate.clientY - dialRect.top  - dialRect.height / 2
      const angle = Math.atan2(y, x)    // angle = π/2 - 2πΘ, Θ = value / maxValue
      this.setValue(Math.round(angle * this.maxValue / (2 * Math.PI) + this.maxValue / 4 + this.maxValue) % this.maxValue)
    }
    event.preventDefault()
  }

  private onDragEnd(event: Event) {
    this.dragging = false
    event.preventDefault()
  }
}
