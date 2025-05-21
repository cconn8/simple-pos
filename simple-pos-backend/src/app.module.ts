import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormTemplatesModule } from './form-templates/form-templates.module';
import { FuneralsModule } from './funerals/funerals.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [FormTemplatesModule, FuneralsModule, MongooseModule.forRoot('mongodb+srv://colm:@Hellmans4167@cluster0.zi4dix8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
