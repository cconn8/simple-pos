import { Body, Controller, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post(':funeral_id')
  async generateInvoice(@Param('funeral_id') id: string, @Body() body: any) {
    console.log('Received invoice request for funeral ID:', id);
    console.log('Payload body:', JSON.stringify(body, null, 2));

    try {
      const url = await this.invoiceService.generateInvoice(id, body);
      console.log('Invoice URL generated:', url);
      return url;
    } catch (error) {
      console.error('Error generating invoice:', error.message);
      console.error(error.stack);
      throw new InternalServerErrorException('Failed to generate invoice.');
    }
  }

  @Delete('delete')
  async deleteInvoice(@Body() body: { funeralId: string; invoiceUrl: string }) {
    console.log('Received delete invoice request:', body);

    try {
      const { funeralId, invoiceUrl } = body;
      
      // Delete the file from storage
      await this.invoiceService.deleteFileGCS(invoiceUrl);
      console.log('Invoice file deleted from storage');

      // Clear the invoice URL from the database
      await this.invoiceService.clearInvoiceFromDatabase(funeralId);
      console.log('Invoice URL cleared from database');

      return { 
        success: true, 
        message: 'Invoice deleted successfully' 
      };
    } catch (error) {
      console.error('Error deleting invoice:', error.message);
      console.error(error.stack);
      throw new InternalServerErrorException('Failed to delete invoice.');
    }
  }
}
