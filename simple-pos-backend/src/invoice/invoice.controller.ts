import { Controller, Param, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
    

    @Post(':funeral_id')
    async generateInvoice(@Param('funeral_id') id: string) {
        const url = await this.invoiceService.generateInvoice(id);
        return url;
    }

}
