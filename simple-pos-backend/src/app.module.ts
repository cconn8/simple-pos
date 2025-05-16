import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormTemplatesModule } from './form-templates/form-templates.module';
import { FuneralsModule } from './funerals/funerals.module';

@Module({
  imports: [FormTemplatesModule, FuneralsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
