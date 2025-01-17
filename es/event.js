export function dispatchCustomEvent(target, type, bubbles, cancelable, detail) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, bubbles, cancelable, detail);
    // fix: `event.preventDefault()` does not set `event.defaultPrevented` on IE
    // https://stackoverflow.com/questions/23349191/event-preventdefault-is-not-working-in-ie-11-for-custom-events
    event.preventDefault = function () {
        Object.defineProperty(this, 'defaultPrevented', { get: function () { return true; } });
    };
    target.dispatchEvent(event);
    return event;
}
