import touchEventsSupported from './touch-events-supported';
import { dispatchCustomEvent } from './event';
import { getClockletData } from './data';
var ClockletDial = /** @class */ (function () {
    function ClockletDial(dial, maxValue, setValue) {
        this.dial = dial;
        this.maxValue = maxValue;
        this.setValue = setValue;
        this.hand = this.dial.getElementsByClassName("clocklet-hand")[0];
        this.dragging = false;
        if (window.PointerEvent) {
            dial.addEventListener('pointerdown', this._onDragStart.bind(this));
            addEventListener('pointermove', this._onDrag.bind(this), true);
            addEventListener('pointerup', this._onDragEnd.bind(this), true);
        }
        else if (touchEventsSupported) {
            dial.addEventListener('touchstart', this._onDragStart.bind(this));
            dial.addEventListener('touchmove', this._onDrag.bind(this));
            dial.addEventListener('touchend', this._onDragEnd.bind(this));
        }
        else {
            dial.addEventListener('mousedown', this._onDragStart.bind(this));
            addEventListener('mousemove', this._onDrag.bind(this), true);
            addEventListener('mouseup', this._onDragEnd.bind(this), true);
        }
    }
    ClockletDial.prototype.value = function (value) {
        this.hand.style.transform = "rotate(" + value * 360 / this.maxValue + "deg)";
        var selectedClassName = "clocklet-tick--selected";
        var previousSelected = this.dial.getElementsByClassName(selectedClassName)[0];
        var currentSelected = this.dial.querySelector("[data-clocklet-tick-value=\"" + value + "\"]");
        if (previousSelected !== currentSelected) {
            previousSelected && previousSelected.classList.remove(selectedClassName);
            currentSelected && currentSelected.classList.add(selectedClassName);
        }
    };
    ClockletDial.prototype._onDragStart = function (event) {
        if (event.touches && event.touches.length > 1) {
            this.dragging = false;
            return;
        }
        this.dragging = true;
        var tickValue = getClockletData(event.target, 'tick-value');
        tickValue && this.setValue(tickValue);
        event.preventDefault();
        dispatchCustomEvent(this.dial, 'clocklet.dragstart', true, false);
    };
    ClockletDial.prototype._onDrag = function (event) {
        if (!this.dragging) {
            return;
        }
        var coordinate = event.targetTouches ? event.targetTouches[0] : event;
        var targetElement = document.elementFromPoint(coordinate.clientX, coordinate.clientY);
        var tickValue = targetElement && getClockletData(targetElement, 'tick-value');
        if (tickValue && this.dial.contains(targetElement)) {
            this.setValue(tickValue);
        }
        else {
            var dialRect = this.dial.getBoundingClientRect();
            var x = coordinate.clientX - dialRect.left - dialRect.width / 2; // event x from the center of this dial
            var y = coordinate.clientY - dialRect.top - dialRect.height / 2;
            var angle = Math.atan2(y, x); // angle = π/2 - 2πΘ, Θ = value / maxValue
            this.setValue(Math.round(angle * this.maxValue / (2 * Math.PI) + this.maxValue / 4 + this.maxValue) % this.maxValue);
        }
        event.preventDefault();
    };
    ClockletDial.prototype._onDragEnd = function (event) {
        this.dragging = false;
        event.preventDefault();
        dispatchCustomEvent(this.dial, 'clocklet.dragend', true, false);
    };
    return ClockletDial;
}());
export default ClockletDial;
