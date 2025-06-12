import { Body, Controller, Param, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}
    

    @Post(':funeral_id')
    async generateInvoice(@Param('funeral_id') id: string, @Body() body: any) {
        console.log('received on the server Param , and Body :', id, body);
        const url = await this.invoiceService.generateInvoice(id, body);
        return url;
    }

}
