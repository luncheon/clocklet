import { __assign } from 'tslib';
import lenientime from 'lenientime/es/core';
import { tokenizeTemplate } from 'lenientime/es/core/token';
import isTouchDevice from './is-touch-device';
import ClockletDial from './dial';
import { defaultDefaultOptions } from './options';
import template from './template.pug';
var Clocklet = /** @class */ (function () {
    function Clocklet(options) {
        var _this = this;
        this.root = Clocklet._createElement();
        this.plate = this.root.firstElementChild;
        this.hour = new ClockletDial(this.plate.getElementsByClassName('clocklet-dial--hour')[0], 12, function (value) { return _this.value({ h: value }); }, function () { return _this.root.classList.add('clocklet--dragging'); }, function () { return _this.root.classList.remove('clocklet--dragging'); });
        this.minute = new ClockletDial(this.plate.getElementsByClassName('clocklet-dial--minute')[0], 60, function (value) { return _this.value({ m: value }); }, function () { return _this.root.classList.add('clocklet--dragging'); }, function () { return _this.root.classList.remove('clocklet--dragging'); });
        this.ampm = this.plate.getElementsByClassName('clocklet-ampm')[0];
        this.defaultOptions = __assign(Object.create(defaultDefaultOptions), options);
        addEventListener('input', function (event) { return event.target === _this.input && _this.updateHighlight(); }, true);
        this.root.addEventListener('mousedown', function (event) { return event.preventDefault(); });
        this.ampm.addEventListener('mousedown', function () { return _this.value({ a: _this.ampm.dataset.clockletAmpm === 'pm' ? 'am' : 'pm' }); });
    }
    Clocklet._createElement = function () {
        var element = document.createElement('div');
        element.className = 'clocklet';
        element.innerHTML = template;
        return element;
    };
    Clocklet.prototype.open = function (input, options) {
        this._open(input, options, true);
    };
    Clocklet.prototype.openWithoutEvents = function (input, options) {
        this._open(input, options, false);
    };
    Clocklet.prototype._open = function (input, options, withEvents) {
        var resolvedOptions = __assign(Object.create(this.defaultOptions), options);
        var inputRect = input.getBoundingClientRect();
        var root = this.root;
        var eventDetail = { options: resolvedOptions };
        if (withEvents && dispatchCustomEvent(input, 'clocklet.opening', true, true, eventDetail).defaultPrevented) {
            return;
        }
        this.input = input;
        this.updateHighlight();
        this.dispatchesInputEvents = resolvedOptions.dispatchesInputEvents;
        root.dataset.clockletPlacement = resolvedOptions.placement;
        root.dataset.clockletAlignment = resolvedOptions.alignment;
        root.dataset.clockletFormat = resolvedOptions.format;
        root.style.left = document.documentElement.scrollLeft + document.body.scrollLeft + inputRect.left - (resolvedOptions.alignment === 'right' ? root.offsetWidth - inputRect.width : 0) + 'px';
        root.style.top = document.documentElement.scrollTop + document.body.scrollTop + inputRect.bottom - (resolvedOptions.placement === 'top' ? root.offsetHeight + inputRect.height + 1 : 0) + 'px';
        root.style.zIndex = resolvedOptions.zIndex !== '' ? resolvedOptions.zIndex : (parseInt(getComputedStyle(input).zIndex, 10) || 0) + 1;
        root.className = 'clocklet clocklet--shown ' + (isTouchDevice ? '' : 'clocklet--hoverable ') + resolvedOptions.className;
        withEvents && dispatchCustomEvent(input, 'clocklet.opened', true, false, eventDetail);
    };
    Clocklet.prototype.close = function () {
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
        this.root.className = 'clocklet';
        dispatchCustomEvent(input, 'clocklet.closed', true, false, eventDetail);
    };
    Clocklet.prototype.value = function (time) {
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
    Clocklet.prototype.updateHighlight = function () {
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
    return Clocklet;
}());
export default Clocklet;
function dispatchCustomEvent(target, type, bubbles, cancelable, detail) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(type, bubbles, cancelable, detail);
    target.dispatchEvent(event);
    return event;
}
function findHourToken(time, template) {
    return findToken(time, template, /[Hhk]$/);
}
function findMinuteToken(time, template) {
    return findToken(time, template, /m$/);
}
function findAmpmToken(time, template) {
    return findToken(time, template, /a/i);
}
function findToken(time, template, pattern) {
    var index = 0;
    for (var _i = 0, _a = tokenizeTemplate(template); _i < _a.length; _i++) {
        var token = _a[_i];
        if (token.literal) {
            index += token.property.length;
        }
        else {
            var value = time[token.property];
            if (pattern.test(token.property)) {
                return { index: index, value: value };
            }
            else {
                index += value.length;
            }
        }
    }
    return;
}
