export default class ClockletDial {
  private dialElement: HTMLElement
  private handElement: HTMLElement

  constructor(plateElement: HTMLElement, private id: 'hour' | 'minute', private maxValue: number) {
    this.dialElement = plateElement.getElementsByClassName(`clocklet__dial-${this.id}`)[0] as HTMLElement
    this.handElement = this.dialElement.getElementsByClassName(`clocklet-dial__hand`)[0] as HTMLElement
  }

  public value(value: number) {
    this.handElement.style.transform = `rotate(${value * 360 / this.maxValue}deg)`
    const selectedClassName = `clocklet-dial__tick--selected`
    const previousSelected  = this.dialElement.getElementsByClassName(selectedClassName)[0]
    const currentSelected   = this.dialElement.querySelector(`.clocklet-dial__tick[data-clocklet-tick-value="${value}"]`)
    if (previousSelected !== currentSelected) {
      previousSelected && previousSelected.classList.remove(selectedClassName)
      currentSelected  && currentSelected .classList.add(selectedClassName)
    }
  }

  public contains(element: HTMLElement) {
    return this.dialElement.contains(element)
  }
}
