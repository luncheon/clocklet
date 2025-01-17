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
    private _relocate?;
    constructor(options?: Partial<Readonly<ClockletOptions>>);
    open(input: HTMLInputElement, options?: Partial<Readonly<ClockletOptions>>): void;
    close(): void;
    inline(container: HTMLElement, { input, format }?: {
        input?: HTMLInputElement;
        format?: string;
    }): ClockletClock;
    value(time: {
        h?: number | string;
        m?: number | string;
        a?: 'am' | 'pm';
    } | string): void;
    private updateHighlight;
}
