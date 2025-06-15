import { Module, forwardRef } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { FuneralsModule } from 'src/funerals/funerals.module';
import { GoogleAuthService } from 'src/google/google-auth.service';
import { GoogleModule } from 'src/google/google.module';
import { FuneralsService } from 'src/funerals/funerals.service';

@Module({
  providers: [InvoiceService, GoogleAuthService],
  controllers: [InvoiceController],
  imports: [
    GoogleModule, //  GoogleAuthService becomes available here
    forwardRef(() => FuneralsModule)
  ],
  exports: [InvoiceService]

})
export class InvoiceModule {}

