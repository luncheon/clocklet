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
  3. Add `"data-clocklet"` attribute to input elements

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

Options can be specified as semicolon-separated `data-clocklet` attribute value.  

```html
<input data-clocklet="format: hh:mm a; placement: top;">
```

| Name       | Type               | Default  | Description                                                                                     |
| ---------- | ------------------ | -------- | ----------------------------------------------------------------------------------------------- |
| class-name | string             | ""       | Class name to set to the root element of the popup.                                             |
| format     | string             | "HH:mm"  | Time format (template) of the input element.<br>Some tokens are replaced with the selected time value.<br>See the [format tokens](#format-tokens) section below. |
| placement  | "top" \| "bottom"  | "bottom" | Popup placement.                                                                                |
| alignment  | "left" \| "right"  | "left"   | Popup alignment.                                                                                |
| append-to  | "body" \| "parent" | "body"   | The parent element into which the popup element will be inserted.                               |
| z-index    | number \| string   | ""       | Popup z-order.<br>If this value is an empty string, (1 + z-index of the input element) is used. |

### Format tokens

| Token | Range            | Description                                                      |
| ----- | ---------------- | ---------------------------------------------------------------- |
| H     | "0" .. "23"      | Hour in 0-based 24-hour notation with no padding.                |
| HH    | "00" .. "23"     | Hour in 0-based 24-hour notation with zero padding.              |
| \_H   | " 0" .. "23"     | Hour in 0-based 24-hour notation with space padding.             |
| h     | "1" .. "12"      | Hour in 1-based 12-hour notation with no padding.                |
| hh    | "01" .. "12"     | Hour in 1-based 12-hour notation with zero padding.              |
| \_h   | " 1" .. "12"     | Hour in 1-based 12-hour notation with space padding.             |
| k     | "1" .. "24"      | Hour in 1-based 24-hour notation with no padding.                |
| kk    | "01" .. "24"     | Hour in 1-based 24-hour notation with zero padding.              |
| \_k   | " 1" .. "24"     | Hour in 1-based 24-hour notation with space padding.             |
| m     | "1" .. "59"      | Minute with no padding.                                          |
| mm    | "01" .. "59"     | Minute with zero padding.                                        |
| \_m   | " 1" .. "59"     | Minute with space padding.                                       |
| a     | "am" \| "pm"     | Post or ante meridiem abbreviation in lowercase without periods. |
| aa    | "a.m." \| "p.m." | Post or ante meridiem abbreviation in lowercase with periods.    |
| A     | "AM" \| "PM"     | Post or ante meridiem abbreviation in uppercase without periods. |
| AA    | "A.M." \| "P.M." | Post or ante meridiem abbreviation in uppercase with periods.    |


## Events

Following events are raised on the input element by this library.

| Type             | Cancelable | event.details      | Description                               |
| ---------------- | ---------- | ------------------ | ----------------------------------------- |
| clocklet.opening | **true**   | { options: {...} } | Raised before showing the clocklet popup. |
| clocklet.opened  | false      | { options: {...} } | Raised after showing the clocklet popup.  |
| clocklet.closing | **true**   | {}                 | Raised before hiding the clocklet popup.  |
| clocklet.closed  | false      | {}                 | Raised after hiding the clocklet popup.   |
| input            | false      | undefined          | Raised after changing the input value.    |


## License

WTFPL
