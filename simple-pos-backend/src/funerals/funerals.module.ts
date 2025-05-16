import { Module } from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { FuneralsController } from './funerals.controller';

@Module({
  controllers: [FuneralsController],
  providers: [FuneralsService],
})
export class FuneralsModule {}
