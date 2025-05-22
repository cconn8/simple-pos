import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormTemplatesModule } from './form-templates/form-templates.module';
import { FuneralsModule } from './funerals/funerals.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true}),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('MONGO_URI'),
        }),
        inject: [ConfigService],
      }),
      FormTemplatesModule, 
      FuneralsModule
    ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
