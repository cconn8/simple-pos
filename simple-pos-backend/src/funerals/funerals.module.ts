import { Module } from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { FuneralsController } from './funerals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Funeral, FuneralSchema } from './schemas/funeral.schema';

@Module({
  imports : [MongooseModule.forFeature([{name : Funeral.name, schema: FuneralSchema}])],
  controllers: [FuneralsController],
  providers: [FuneralsService],
  exports: [FuneralsService]
})
export class FuneralsModule {}
