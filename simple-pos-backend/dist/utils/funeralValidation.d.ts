import { FuneralDataV2 } from './funeralTransformation';
export declare function validateFuneralData(data: any): data is FuneralDataV2;
export declare function createDefaultFuneralData(): FuneralDataV2;
export declare function safeString(value: any, defaultValue?: string): string;
export declare function safeArray<T>(value: any, defaultValue?: T[]): T[];
export declare function safeObject<T>(value: any, defaultValue: T): T;
