import { Response } from 'express';
import { XeroService } from './xero.service';
export declare class XeroController {
    private readonly xeroService;
    private readonly logger;
    constructor(xeroService: XeroService);
    connect(res: Response): Promise<void | Response<any, Record<string, any>>>;
    callback(query: any, res: Response): Promise<void>;
    status(): Promise<{
        success: boolean;
        authenticated: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        authenticated: boolean;
        error: string;
        message?: undefined;
    }>;
    disconnect(): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
}
