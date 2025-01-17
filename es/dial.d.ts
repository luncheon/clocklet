export default class ClockletDial {
    dial: HTMLElement;
    private maxValue;
    private setValue;
    hand: HTMLElement;
    private dragging;
    constructor(dial: HTMLElement, maxValue: number, setValue: (value: string | number) => void);
    value(value: number): void;
    private _onDragStart;
    private _onDrag;
    private _onDragEnd;
}
