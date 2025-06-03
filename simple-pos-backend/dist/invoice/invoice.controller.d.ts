import { InvoiceService } from './invoice.service';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    generateInvoice(id: string): Promise<any>;
}
