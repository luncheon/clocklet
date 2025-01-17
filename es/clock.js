import { __assign } from 'tslib';
import lenientime from 'lenientime/es/core';
import ClockletDial from './dial';
import { defaultDefaultOptions } from './options';
import template from './template.pug';
import { dispatchCustomEvent } from './event';
import { findHourToken, findMinuteToken, findAmpmToken } from './token';
import { setClockletData, getClockletData } from './data';
var coordinateProperties = ['position', 'left', 'top', 'right', 'bottom', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom'];
var hoverable = matchMedia('(hover: none)').matches;
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
        this.ampm.addEventListener('mousedown', function () { return _this.value({ a: getClockletData(_this.ampm, 'ampm') === 'pm' ? 'am' : 'pm' }); });
        this.root.addEventListener('clocklet.dragstart', function () { return _this.root.classList.add('clocklet--dragging'); });
        this.root.addEventListener('clocklet.dragend', function () { return _this.root.classList.remove('clocklet--dragging'); });
        var relocate = function () { return _this._relocate && _this._relocate(); };
        addEventListener('resize', relocate);
        addEventListener('orientationchange', relocate);
    }
    ClockletClock.prototype.open = function (input, options) {
        var _this = this;
        var resolvedOptions = __assign(Object.create(this.defaultOptions), options);
        var inputRect = input.getBoundingClientRect();
        var inputStyle = getComputedStyle(input);
        var _a = this, container = _a.container, root = _a.root;
        var eventDetail = { options: resolvedOptions };
        if (dispatchCustomEvent(input, 'clocklet.opening', true, true, eventDetail).defaultPrevented) {
            return;
        }
        this.input = input;
        this.dispatchesInputEvents = resolvedOptions.dispatchesInputEvents;
        setClockletData(root, 'placement', resolvedOptions.placement);
        setClockletData(root, 'alignment', resolvedOptions.alignment);
        setClockletData(root, 'format', resolvedOptions.format);
        setClockletData(root, 'append-to', resolvedOptions.appendTo);
        root.className = 'clocklet clocklet--showing ' + (hoverable ? '' : 'clocklet--hoverable ') + resolvedOptions.className;
        container.style.zIndex = resolvedOptions.zIndex !== '' ? resolvedOptions.zIndex : (parseInt(inputStyle.zIndex, 10) || 0) + 1;
        if (resolvedOptions.appendTo === 'parent') {
            input.parentElement.insertBefore(container, input);
        }
        else if (container.parentElement !== document.body) {
            document.body.appendChild(container);
        }
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
        else if (resolvedOptions.alignment === 'center') {
            root.style.left = (input.offsetWidth - root.offsetWidth) / 2 + "px";
            root.style.right = '';
        }
        else {
            root.style.left = '0';
            root.style.right = '';
        }
        if (inputStyle.position === 'fixed' || resolvedOptions.appendTo === 'parent' && inputStyle.position === 'absolute') {
            this._relocate = undefined;
            copyStyles(container.style, inputStyle, coordinateProperties);
        }
        else {
            copyStyles(container.style, {}, coordinateProperties);
            if (resolvedOptions.appendTo === 'parent') {
                var parentStyle = getComputedStyle(input.parentElement);
                if (parentStyle.display === 'flex' || parentStyle.display === 'inline-flex') {
                    container.style.position = 'absolute';
                    this._relocate = function () {
                        container.style.left = input.offsetLeft + "px";
                        container.style.top = input.offsetTop + "px";
                    };
                }
                else {
                    container.style.position = 'relative';
                    this._relocate = function () {
                        container.style.left = container.style.top
                            = '';
                        container.style.left = input.offsetLeft - container.offsetLeft + "px";
                        container.style.top = input.offsetTop - container.offsetTop + "px";
                    };
                }
            }
            else {
                container.style.position = 'absolute';
                this._relocate = function () {
                    var newInputRect = input.getBoundingClientRect();
                    container.style.left = document.documentElement.scrollLeft + document.body.scrollLeft + newInputRect.left + "px";
                    container.style.top = document.documentElement.scrollTop + document.body.scrollTop + newInputRect.top + "px";
                };
            }
            this._relocate();
        }
        this.updateHighlight();
        setTimeout(function () {
            root.classList.remove('clocklet--showing');
            if (_this.input) {
                root.classList.add('clocklet--shown');
            }
        });
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
    ClockletClock.prototype.inline = function (container, _a) {
        var _b = _a === void 0 ? {} : _a, input = _b.input, format = _b.format;
        var clock = new ClockletClock(this.defaultOptions);
        container.appendChild(clock.container);
        clock.container.classList.add('clocklet-container--inline');
        clock.root.classList.add('clocklet--inline');
        clock.dispatchesInputEvents = clock.defaultOptions.dispatchesInputEvents;
        format = format || clock.defaultOptions.format;
        setClockletData(clock.root, 'format', format);
        if (!input) {
            input = container.appendChild(document.createElement('input'));
            input.style.display = 'none';
        }
        input.setAttribute('data-clocklet', 'format:' + format);
        input.setAttribute('data-clocklet-inline', '');
        clock.input = input;
        clock.updateHighlight();
        return clock;
    };
    ClockletClock.prototype.value = function (time) {
        if (!this.input) {
            return;
        }
        var oldValue = this.input.value;
        var _time = typeof time === 'string'
            ? lenientime(time)
            : lenientime(this.input.value).with(time.a !== undefined ? time : { h: time.h, m: time.m, a: getClockletData(this.ampm, 'ampm') });
        var template = getClockletData(this.root, 'format');
        this.input.value = _time.format(template);
        if (this.input.type === 'text' && typeof time === 'object') {
            var token = time.h !== undefined ? findHourToken(_time, template) :
                time.m !== undefined ? findMinuteToken(_time, template) :
                    time.a !== undefined ? findAmpmToken(_time, template) || findHourToken(_time, template) :
                        undefined;
            token && this.input.setSelectionRange(token.index, token.index + token.value.length);
        }
        this.dispatchesInputEvents && this.input.value !== oldValue && dispatchCustomEvent(this.input, 'input', true, false, { time: _time });
    };
    ClockletClock.prototype.updateHighlight = function () {
        if (!this.input) {
            return;
        }
        var time = this.input.value ? lenientime(this.input.value) : lenientime.INVALID;
        if (time.valid) {
            setClockletData(this.root, 'value', time.HHmm);
            this.hour.value(time.hour % 12);
            this.minute.value(time.minute);
            setClockletData(this.ampm, 'ampm', time.a);
        }
        else {
            setClockletData(this.root, 'value', '');
            this.hour.value(-1);
            this.minute.value(-1);
            setClockletData(this.ampm, 'ampm', 'am');
        }
        var ampmToken = findAmpmToken(time.valid ? time : lenientime.ZERO, getClockletData(this.root, 'format'));
        setClockletData(this.ampm, 'ampm-formatted', ampmToken && ampmToken.value || '');
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
function copyStyles(destination, source, properties) {
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property = properties_1[_i];
        destination[property] = source[property] || '';
    }
}
