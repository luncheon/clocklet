import Lenientime from 'lenientime/es/core/lenientime';
export declare function findHourToken(time: Lenientime, template: string): {
    index: number;
    value: any;
} | undefined;
export declare function findMinuteToken(time: Lenientime, template: string): {
    index: number;
    value: any;
} | undefined;
export declare function findAmpmToken(time: Lenientime, template: string): {
    index: number;
    value: any;
} | undefined;
