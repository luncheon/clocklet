import { tokenizeTemplate } from 'lenientime/es/core/token';
export function findHourToken(time, template) {
    return findToken(time, template, /[Hhk]$/);
}
export function findMinuteToken(time, template) {
    return findToken(time, template, /m$/);
}
export function findAmpmToken(time, template) {
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
