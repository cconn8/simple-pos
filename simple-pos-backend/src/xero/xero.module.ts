import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { XeroService } from './xero.service';
import { XeroController } from './xero.controller';
import { TokenStorageService } from '../storage/token-storage.service';

@Module({
  imports: [ConfigModule],
  controllers: [XeroController],
  providers: [XeroService, TokenStorageService],
  exports: [XeroService]
})
export class XeroModule {}