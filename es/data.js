export function getClockletData(element, attributeName) {
    return element.getAttribute('data-clocklet-' + attributeName);
}
export function setClockletData(element, attributeName, value) {
    element.setAttribute('data-clocklet-' + attributeName, value);
}
