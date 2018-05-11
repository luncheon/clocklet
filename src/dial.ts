import div from './div'

export default class ClockletDial {
  private BLOCK_NAME = `clocklet-dial`
  private dialElement = div(`${this.BLOCK_NAME} clocklet__dial-${this.id}`)
  private handElement = div(`${this.BLOCK_NAME}__hand`)
  private tickElements = mapRange(this.maxValue, i => tick(this.BLOCK_NAME, i, this.maxValue, this.handLengthSelector(i)))

  constructor(plateElement: HTMLElement, private id: 'hour' | 'minute', private maxValue: number, private handLengthSelector: (tick: number) => number) {
    const dialElement = this.dialElement
    plateElement.appendChild(dialElement)
    dialElement.appendChild(this.handElement)
    for (const tickElement of this.tickElements) {
      dialElement.appendChild(tickElement)
    }
  }

  public value(value: number) {
    this.handElement.style.transform = `rotate(${value * 360 / this.maxValue}deg)`
    const selectedClassName = `${this.BLOCK_NAME}__tick--selected`
    const previousSelected  = this.dialElement.getElementsByClassName(selectedClassName)[0]
    const currentSelected   = this.dialElement.querySelector(`.${this.BLOCK_NAME}__tick[data-clocklet-tick-value="${value}"]`)
    if (previousSelected !== currentSelected) {
      previousSelected && previousSelected.classList.remove(selectedClassName)
      currentSelected  && currentSelected .classList.add(selectedClassName)
    }
  }

  public contains(element: HTMLElement) {
    return this.dialElement.contains(element)
  }
}

function tick(blockName: string, value: number, maxValue: number, radius: number) {
  const angle = Math.PI * (.5 - 2 * value / maxValue)   // π/2 - 2πΘ
  const element = document.createElement('button')
  element.className = `${blockName}__tick`
  element.dataset.clockletTickValue = value as any
  element.style.left  = 50 + radius * Math.cos(angle) + '%'
  element.style.top   = 50 - radius * Math.sin(angle) + '%'
  return element
}

function mapRange<T>(endExclusive: number, selector: (i: number) => T): T[] {
  const result = [] as T[]
  for (let i = 0; i < endExclusive; ++i) {
    result.push(selector(i))
  }
  return result
}
