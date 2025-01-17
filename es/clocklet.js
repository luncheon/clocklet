import adjustOnArrowKeys from 'lenientime/es/input-helpers/adjust-on-arrow-keys';
import complete from 'lenientime/es/input-helpers/complete';
import ClockletClock from './clock';
import { parseOptions } from './options';
{
    var lenientimeOptions = {
        dataAttributeName: 'clocklet',
        formatSelector: function (input) {
            var options = parseOptions(input.getAttribute('data-clocklet'));
            return options && options.format;
        }
    };
    complete(lenientimeOptions);
    adjustOnArrowKeys(lenientimeOptions);
}
function clocklet(options) {
    if (options === void 0) { options = {}; }
    var instance = new ClockletClock(options.defaultOptions);
    var target = options.target || 'input[data-clocklet]:not([data-clocklet-inline])';
    var optionsSelector = options.optionsSelector || (function (target) { return parseOptions(target.getAttribute('data-clocklet')); });
    var close = instance.close.bind(instance);
    if (target instanceof Element) {
        target.addEventListener('focus', function (event) { return instance.open(event.target, optionsSelector(event.target)); });
        target.addEventListener('blur', close);
    }
    else {
        var isTarget_1 = typeof target === 'function' ? target : function (element) { return (Element.prototype.matches || Element.prototype.msMatchesSelector).call(element, target); };
        addEventListener('focusin', function (event) {
            var element = event.target;
            isTarget_1(element) && instance.open(element, optionsSelector(element));
        }, true);
        addEventListener('focusout', close, true);
    }
    return instance;
}
export default clocklet();
