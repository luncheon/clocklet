export default class ClockletDial {
    dial: HTMLElement;
    private maxValue;
    private setValue;
    private onDragStart;
    private onDragEnd;
    hand: HTMLElement;
    private dragging;
    constructor(dial: HTMLElement, maxValue: number, setValue: (value: string | number) => void, onDragStart: () => void, onDragEnd: () => void);
    value(value: number): void;
    contains(element: HTMLElement): boolean;
    private _onDragStart(event);
    private _onDrag(event);
    private _onDragEnd(event);
}
