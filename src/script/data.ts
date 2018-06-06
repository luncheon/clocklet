export function getClockletData(element: Element, attributeName: string) {
  return element.getAttribute('data-clocklet-' + attributeName)
}

export function setClockletData(element: Element, attributeName: string, value: string) {
  element.setAttribute('data-clocklet-' + attributeName, value)
}
