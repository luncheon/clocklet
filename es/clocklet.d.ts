import ClockletDial from './dial';
import { ClockletOptions } from './options';
export default class Clocklet {
    container: HTMLDivElement;
    root: HTMLElement;
    plate: HTMLElement;
    hour: ClockletDial;
    minute: ClockletDial;
    ampm: HTMLElement;
    defaultOptions: ClockletOptions;
    input: HTMLInputElement | undefined;
    dispatchesInputEvents: boolean | undefined;
    constructor(options?: Partial<Readonly<ClockletOptions>>);
    open(input: HTMLInputElement, options?: Partial<Readonly<ClockletOptions>>): void;
    openWithoutEvents(input: HTMLInputElement, options?: Partial<Readonly<ClockletOptions>>): void;
    private _open(input, options, withEvents);
    close(): void;
    private value(time);
    private updateHighlight();
}
