import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { FuneralsModule } from 'src/funerals/funerals.module';
import { GoogleAuthService } from 'src/google/google-auth.service';

@Module({
  providers: [InvoiceService, GoogleAuthService],
  controllers: [InvoiceController],
  imports: [FuneralsModule]

})
export class InvoiceModule {}

