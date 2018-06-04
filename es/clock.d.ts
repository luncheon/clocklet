import ClockletDial from './dial';
import { ClockletOptions } from './options';
export default class ClockletClock {
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
    close(): void;
    private value;
    private updateHighlight;
}
