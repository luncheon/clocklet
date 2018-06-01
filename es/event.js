export function dispatchCustomEvent(target, type, bubbles, cancelable, detail) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, bubbles, cancelable, detail);
    target.dispatchEvent(event);
    return event;
}
