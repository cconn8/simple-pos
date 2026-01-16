import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { XeroService, XeroPostingData } from '../xero/xero.service';
export declare class FuneralsController {
    private readonly funeralsService;
    private readonly invoiceService;
    private readonly xeroService;
    private readonly logger;
    constructor(funeralsService: FuneralsService, invoiceService: InvoiceService, xeroService: XeroService);
    create(createFuneralDto: CreateFuneralDto): Promise<import("./schemas/funeral.schema").Funeral>;
    findAll(): Promise<(import("./schemas/funeral.schema").Funeral & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOneById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/funeral.schema").Funeral, {}> & import("./schemas/funeral.schema").Funeral & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, updateFuneralDto: UpdateFuneralDto): Promise<any>;
    remove(id: string, body: {
        invoiceUrl: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/funeral.schema").Funeral, {}> & import("./schemas/funeral.schema").Funeral & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    postToXero(id: string, postingData: XeroPostingData): Promise<{
        success: boolean;
        error: string;
        existingData: {
            contactId?: string;
            invoiceId?: string;
            invoiceUrl?: string;
            invoiceNumber?: string;
            reference?: string;
            amountPosted?: number;
            postedAt?: Date;
            status?: "posting" | "posted" | "failed";
            errorMessage?: string;
        };
        message?: undefined;
        xeroData?: undefined;
        isDuplicateInvoice?: undefined;
        duplicateInvoiceNumber?: undefined;
    } | {
        success: boolean;
        message: string;
        xeroData: {
            contactId: string;
            invoiceId: string;
            invoiceUrl: string;
            status: string;
            postedAt: string;
        };
        error?: undefined;
        existingData?: undefined;
        isDuplicateInvoice?: undefined;
        duplicateInvoiceNumber?: undefined;
    } | {
        success: boolean;
        isDuplicateInvoice: boolean;
        duplicateInvoiceNumber: string;
        error: string;
        existingData?: undefined;
        message?: undefined;
        xeroData?: undefined;
    } | {
        success: boolean;
        error: any;
        existingData?: undefined;
        message?: undefined;
        xeroData?: undefined;
        isDuplicateInvoice?: undefined;
        duplicateInvoiceNumber?: undefined;
    }>;
    markAsPosted(id: string, postingData: XeroPostingData): Promise<{
        success: boolean;
        message: string;
        xeroData: {
            contactId: string;
            invoiceId: string;
            invoiceUrl: string;
            status: string;
            postedAt: string;
            isExistingInvoice: boolean;
        };
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
        xeroData?: undefined;
    }>;
    resetXeroData(id: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        message?: undefined;
    }>;
}
