export var defaultDefaultOptions = {
    className: '',
    format: 'HH:mm',
    placement: 'bottom',
    alignment: 'left',
    appendTo: 'body',
    zIndex: '',
    dispatchesInputEvents: true,
};
export function parseOptions(optionsString) {
    if (!optionsString) {
        return;
    }
    var options = {};
    for (var _i = 0, _a = optionsString.split(';'); _i < _a.length; _i++) {
        var s = _a[_i];
        var index = s.indexOf(':');
        options[s.slice(0, index).trim().replace(/[a-zA-Z0-9_]-[a-z]/g, function ($0) { return $0[0] + $0[2].toUpperCase(); })] = s.slice(index + 1).trim();
    }
    return options;
}
