import { __assign } from 'tslib';
import lenientime from 'lenientime/es/core';
import isTouchDevice from './is-touch-device';
import ClockletDial from './dial';
import { defaultDefaultOptions } from './options';
import template from './template.pug';
import { dispatchCustomEvent } from './event';
import { findHourToken, findMinuteToken, findAmpmToken } from './token';
var ClockletClock = /** @class */ (function () {
    function ClockletClock(options) {
        var _this = this;
        this.container = createClockletElements();
        this.root = this.container.firstElementChild;
        this.plate = this.root.firstElementChild;
        this.hour = new ClockletDial(this.plate.getElementsByClassName('clocklet-dial--hour')[0], 12, function (value) { return _this.value({ h: value }); });
        this.minute = new ClockletDial(this.plate.getElementsByClassName('clocklet-dial--minute')[0], 60, function (value) { return _this.value({ m: value }); });
        this.ampm = this.plate.getElementsByClassName('clocklet-ampm')[0];
        this.defaultOptions = __assign(Object.create(defaultDefaultOptions), options);
        addEventListener('input', function (event) { return event.target === _this.input && _this.updateHighlight(); }, true);
        this.root.addEventListener('mousedown', function (event) { return event.preventDefault(); });
        this.ampm.addEventListener('mousedown', function () { return _this.value({ a: _this.ampm.dataset.clockletAmpm === 'pm' ? 'am' : 'pm' }); });
        this.root.addEventListener('clocklet.dragstart', function () { return _this.root.classList.add('clocklet--dragging'); });
        this.root.addEventListener('clocklet.dragend', function () { return _this.root.classList.remove('clocklet--dragging'); });
    }
    ClockletClock.prototype.open = function (input, options) {
        var resolvedOptions = __assign(Object.create(this.defaultOptions), options);
        var inputRect = input.getBoundingClientRect();
        var _a = this, container = _a.container, root = _a.root;
        var eventDetail = { options: resolvedOptions };
        if (dispatchCustomEvent(input, 'clocklet.opening', true, true, eventDetail).defaultPrevented) {
            return;
        }
        this.input = input;
        this.updateHighlight();
        this.dispatchesInputEvents = resolvedOptions.dispatchesInputEvents;
        root.dataset.clockletPlacement = resolvedOptions.placement;
        root.dataset.clockletAlignment = resolvedOptions.alignment;
        root.dataset.clockletFormat = resolvedOptions.format;
        root.dataset.clockletAppendTo = resolvedOptions.appendTo;
        root.className = 'clocklet ' + (isTouchDevice ? '' : 'clocklet--hoverable ') + resolvedOptions.className;
        if (resolvedOptions.placement === 'top') {
            root.style.top = '';
            root.style.bottom = '0';
        }
        else {
            root.style.top = inputRect.height + "px";
            root.style.bottom = '';
        }
        if (resolvedOptions.alignment === 'right') {
            root.style.left = '';
            root.style.right = "-" + inputRect.width + "px";
        }
        else {
            root.style.left = '0';
            root.style.right = '';
        }
        container.style.zIndex = resolvedOptions.zIndex !== '' ? resolvedOptions.zIndex : (parseInt(getComputedStyle(input).zIndex, 10) || 0) + 1;
        if (resolvedOptions.appendTo === 'parent') {
            container.style.position = 'relative';
            container.style.left = '0';
            container.style.top = '0';
            input.parentElement.insertBefore(container, input);
        }
        else {
            container.style.position = 'absolute';
            container.style.left = document.documentElement.scrollLeft + document.body.scrollLeft + inputRect.left + 'px';
            container.style.top = document.documentElement.scrollTop + document.body.scrollTop + inputRect.top + 'px';
            if (container.parentElement !== document.body) {
                document.body.appendChild(container);
            }
        }
        setTimeout(function () { return root.classList.add('clocklet--shown'); });
        dispatchCustomEvent(input, 'clocklet.opened', true, false, eventDetail);
    };
    ClockletClock.prototype.close = function () {
        var input = this.input;
        var eventDetail = {};
        if (!input) {
            return;
        }
        if (dispatchCustomEvent(input, 'clocklet.closing', true, true, eventDetail).defaultPrevented) {
            input.focus();
            return;
        }
        this.input = undefined;
        this.root.classList.remove('clocklet--shown');
        dispatchCustomEvent(input, 'clocklet.closed', true, false, eventDetail);
    };
    ClockletClock.prototype.value = function (time) {
        if (!this.input) {
            return;
        }
        if (time.a === undefined) {
            time = { h: time.h, m: time.m, a: this.ampm.dataset.clockletAmpm };
        }
        var oldValue = this.input.value;
        var _time = lenientime(this.input.value).with(time.a !== undefined ? time : { h: time.h, m: time.m, a: this.ampm.dataset.clockletAmpm });
        var template = this.root.dataset.clockletFormat || 'HH:mm';
        this.input.value = _time.format(template);
        if (this.input.type === 'text') {
            var token = time.h !== undefined ? findHourToken(_time, template) :
                time.m !== undefined ? findMinuteToken(_time, template) :
                    time.a !== undefined ? findAmpmToken(_time, template) || findHourToken(_time, template) :
                        undefined;
            token && this.input.setSelectionRange(token.index, token.index + token.value.length);
        }
        this.dispatchesInputEvents && this.input.value !== oldValue && dispatchCustomEvent(this.input, 'input', true, false, undefined);
    };
    ClockletClock.prototype.updateHighlight = function () {
        if (!this.input) {
            return;
        }
        if (this.input.value) {
            var time = lenientime(this.input.value);
            this.root.dataset.clockletValue = time.HHmm;
            this.hour.value(time.hour % 12);
            this.minute.value(time.minute);
            this.ampm.dataset.clockletAmpm = time.a;
        }
        else {
            this.root.dataset.clockletValue = '';
            this.hour.value(-1);
            this.minute.value(-1);
            this.ampm.dataset.clockletAmpm = 'am';
        }
    };
    return ClockletClock;
}());
export default ClockletClock;
function createClockletElements() {
    var element = document.createElement('div');
    element.className = 'clocklet-container';
    element.innerHTML = template;
    return element;
}
