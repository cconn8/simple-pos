import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    generateInvoice(id: string, body: any): Promise<any>;
    deleteInvoice(body: {
        funeralId: string;
        invoiceUrl: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
