import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { FuneralsService } from 'src/funerals/funerals.service';
import { FuneralsModule } from 'src/funerals/funerals.module';

@Module({
  providers: [InvoiceService],
  controllers: [InvoiceController],
  imports: [FuneralsModule]

})
export class InvoiceModule {}
