import { Module, forwardRef } from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { FuneralsController } from './funerals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Funeral, FuneralSchema } from './schemas/funeral.schema';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { InvoiceService } from 'src/invoice/invoice.service';
import { GoogleModule } from 'src/google/google.module';
import { XeroModule } from 'src/xero/xero.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Funeral.name, schema: FuneralSchema }]),
    GoogleModule,
    forwardRef(() => InvoiceModule),
    XeroModule,
  ],
  controllers: [FuneralsController],
  providers: [FuneralsService, InvoiceService],
  exports: [FuneralsService],
})
export class FuneralsModule {}
