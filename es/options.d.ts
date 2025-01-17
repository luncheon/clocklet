export interface ClockletOptions {
    className: string;
    format: string;
    placement: 'top' | 'bottom';
    alignment: 'left' | 'right' | 'center';
    appendTo: 'body' | 'parent';
    zIndex: number | string;
    dispatchesInputEvents: boolean;
}
export declare const defaultDefaultOptions: ClockletOptions;
export declare function parseOptions(optionsString?: string | null): Partial<ClockletOptions> | undefined;
