export interface ClockletOptions {
    className: string;
    format: string;
    placement: 'top' | 'bottom';
    alignment: 'left' | 'right';
    zIndex: number | string;
    dispatchesInputEvents: boolean;
}
export declare const defaultDefaultOptions: {
    className: string;
    format: string;
    placement: string;
    alignment: string;
    zIndex: string;
    dispatchesInputEvents: boolean;
};
export declare function parseOptions(optionsString?: string): Partial<ClockletOptions> | undefined;
