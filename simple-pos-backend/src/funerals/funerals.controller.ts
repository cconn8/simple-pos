import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  Logger,
} from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { AuthGuard } from '../auth/auth.guard';
import { XeroService, XeroPostingData } from '../xero/xero.service';

@UseGuards(AuthGuard)
@Controller('funerals')
export class FuneralsController {
  private readonly logger = new Logger(FuneralsController.name);

  constructor(
    private readonly funeralsService: FuneralsService,
    private readonly invoiceService: InvoiceService,
    private readonly xeroService: XeroService,
  ) {}

  @Post()
  async create(@Body() createFuneralDto: CreateFuneralDto) {
    this.logger.log('📝 Creating new funeral record');
    const funeral = await this.funeralsService.create(createFuneralDto);
    this.logger.log(`✅ Funeral created successfully: ${funeral._id}`);
    return funeral;
  }

  @Get()
  async findAll() {
    this.logger.log('📋 Fetching all funeral records');
    const funerals = await this.funeralsService.findAll();
    this.logger.log(`✅ Retrieved ${funerals.length} funeral records`);
    return funerals;
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.funeralsService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFuneralDto: UpdateFuneralDto) {
    const updatedFuneral = await this.funeralsService.findByIdAndUpdate(id, updateFuneralDto);
    return updatedFuneral;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body() body: { invoiceUrl: string }) {
    const { invoiceUrl } = body;
    // Process deletion request
    if (invoiceUrl) {
      await this.invoiceService.deleteFileGCS(invoiceUrl);
      // Invoice deleted from storage
    }

    return this.funeralsService.deleteById(id);
  }

  /**
   * Post a funeral to XERO (creates contact + invoice)
   * POST /funerals/:id/xero/post
   * Temporarily without auth guard for XERO testing
   */
  @SetMetadata('skipAuth', true)
  @Post(':id/xero/post')
  async postToXero(@Param('id') id: string, @Body() postingData: XeroPostingData) {
    try {
      this.logger.log(`💼 Starting Xero posting for funeral: ${id}`);
      
      // First, get the funeral record
      const funeral = await this.funeralsService.findOneById(id);
      if (!funeral) {
        this.logger.error(`❌ Funeral not found: ${id}`);
        return {
          success: false,
          error: 'Funeral record not found'
        };
      }

      // Check if already posted to XERO
      if (funeral.xeroData?.invoiceId) {
        this.logger.warn(`⚠️ Funeral ${id} already posted to Xero`);
        return {
          success: false,
          error: 'This funeral has already been posted to XERO',
          existingData: funeral.xeroData
        };
      }

      // Post to XERO
      this.logger.log(`🔄 Posting to Xero...`);
      const result = await this.xeroService.postFuneralToXero(postingData);

      // If successful, update the funeral record with XERO data
      if (result.success) {
        this.logger.log(`✅ Xero posting successful - updating funeral record`);
        const xeroData = {
          contactId: result.contactId,
          invoiceId: result.invoiceId,
          invoiceUrl: result.invoiceUrl,
          status: 'posted',
          postedAt: new Date().toISOString()
        };

        // Update the funeral record using MongoDB $set operator to avoid overwriting
        await this.funeralsService.findByIdAndUpdateUsingMongoCommand(id, {
          $set: { xeroData: xeroData }
        });

        return {
          success: true,
          message: 'Successfully posted to XERO',
          xeroData: xeroData
        };
      } else if (result.isDuplicateInvoice) {
        // Handle duplicate invoice case
        return {
          success: false,
          isDuplicateInvoice: true,
          duplicateInvoiceNumber: result.duplicateInvoiceNumber,
          error: result.error
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to post to XERO'
        };
      }

    } catch (error) {
      console.error('XERO posting error:', error);
      return {
        success: false,
        error: error.message || 'Internal server error during XERO posting'
      };
    }
  }

  /**
   * Mark as posted to existing XERO invoice
   * POST /funerals/:id/xero/mark-posted
   */
  @SetMetadata('skipAuth', true)
  @Post(':id/xero/mark-posted')
  async markAsPosted(@Param('id') id: string, @Body() postingData: XeroPostingData) {
    try {
      // First, get the funeral record
      const funeral = await this.funeralsService.findOneById(id);
      if (!funeral) {
        return {
          success: false,
          error: 'Funeral record not found'
        };
      }

      // Create contact data for XERO
      const contactData = {
        name: postingData.contactName,
        emailAddress: postingData.contactEmail,
        phones: postingData.contactPhone ? [{ phoneType: 'DEFAULT', phoneNumber: postingData.contactPhone }] : [],
        addresses: postingData.addressLine1 ? [{
          addressType: 'POBOX',
          addressLine1: postingData.addressLine1,
          addressLine2: postingData.addressLine2,
          city: postingData.city,
          region: postingData.region,
          postalCode: postingData.postalCode,
          country: postingData.country || 'Ireland'
        }] : []
      };

      // Mark as posted to existing invoice
      const result = await this.xeroService.markAsPosted(contactData, postingData.invoiceNumber);

      if (result.success) {
        const xeroData = {
          contactId: result.contactId,
          invoiceId: result.invoiceId,
          invoiceUrl: result.invoiceUrl,
          status: 'posted',
          postedAt: new Date().toISOString(),
          isExistingInvoice: true
        };

        // Update the funeral record
        await this.funeralsService.findByIdAndUpdateUsingMongoCommand(id, {
          $set: { xeroData: xeroData }
        });

        return {
          success: true,
          message: `Marked as posted to existing XERO invoice #${postingData.invoiceNumber}`,
          xeroData: xeroData
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to mark as posted to XERO'
        };
      }

    } catch (error) {
      console.error('Mark as posted error:', error);
      return {
        success: false,
        error: error.message || 'Internal server error while marking as posted'
      };
    }
  }

  /**
   * Reset XERO data for a funeral (allows re-posting)
   * DELETE /funerals/:id/xero/reset
   */
  @SetMetadata('skipAuth', true)
  @Delete(':id/xero/reset')
  async resetXeroData(@Param('id') id: string) {
    try {
      await this.funeralsService.findByIdAndUpdateUsingMongoCommand(id, {
        $unset: { xeroData: 1 }
      });

      return {
        success: true,
        message: 'XERO data cleared. You can now post to XERO again.'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to reset XERO data'
      };
    }
  }
}
