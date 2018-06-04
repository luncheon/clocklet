# Clocklet

An opinionated clock-style vanilla-js timepicker.  
[Demo](https://luncheon.github.io/clocklet/demo/demo.html)


## Features

* Intuitive - it looks like a clock
* Mouse and touch friendly
  * 3 clicks are sufficient to pick a time - am/pm, hour, minute
  * Click targets often used are large enough
  * No need to scroll
* Keyboard and numpad friendly
  * Autocomplete - e.g. `"1"`->`"01:00"`, `"12"`->`"12:00"`, `"1234"`->`"12:34"`
  * Support up/down arrow key to increment/decrement
* Declarative usage
  1. Load the stylesheet
  2. Load the script
  3. Add `"data-clocklet"` attribute to input elements (with options)

## Installation

_T.B.D._

<!-- ### via npm

```bash
$ npm install clocklet
```

```javascript
import 'clocklet/css/clocklet.min.css';
import clocklet from 'clocklet';
```

### via CDN

```html
<link rel="https://cdn.jsdelivr.net/npm/clocklet@0.1.0/css/clocklet.min.css">
<script src="https://cdn.jsdelivr.net/npm/clocklet@0.1.0"></script>
``` -->


## Options

| Name       | Type               | Default  | Description                                                                                  |
| ---------- | ------------------ | -------- | -------------------------------------------------------------------------------------------- |
| class-name | string             | ""       | Class name to set to the root element of the popup.                                          |
| format     | string             | "HH:mm"  | Time format (template) of the input element.                                                 |
| placement  | "top" \| "bottom"  | "bottom" | Popup placement.                                                                             |
| alignment  | "left" \| "right"  | "left"   | Popup alignment.                                                                             |
| append-to  | "body" \| "parent" | "body"   | The parent element into which the popup element will be inserted.                            |
| z-index    | number \| string   | ""       | Popup z-order. If this value is an empty string, (1 + z-index of the input element) is used. |


## Events

| Type             | Cancelable | event.details      | Description                               |
| ---------------- | ---------- | ------------------ | ----------------------------------------- |
| clocklet.opening | true       | { options: {...} } | Raises before showing the clocklet popup. |
| clocklet.opened  | false      | { options: {...} } | Raises after showing the clocklet popup.  |
| clocklet.closing | true       | {}                 | Raises before hiding the clocklet popup.  |
| clocklet.closed  | false      | {}                 | Raises after hiding the clocklet popup.   |
| input            | false      | undefined          | Raises after changing the input value.    |


## License

WTFPL
