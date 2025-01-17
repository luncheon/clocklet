var touchEventsSupported;
if (window.ontouchend === undefined) {
    touchEventsSupported = false;
}
else {
    var _ontouchend = window.ontouchend;
    window.ontouchend = undefined;
    touchEventsSupported = window.ontouchend !== undefined;
    window.ontouchend = _ontouchend;
}
export default touchEventsSupported;
