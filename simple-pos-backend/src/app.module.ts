import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormTemplatesModule } from './form-templates/form-templates.module';
import { FuneralsModule } from './funerals/funerals.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvoiceModule } from './invoice/invoice.module';
import { InventoryModule } from './inventory/inventory.module';
import { GoogleAuthService } from './google/google-auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    FormTemplatesModule,
    FuneralsModule,
    InvoiceModule,
    InventoryModule,
    AuthModule,
    UsersModule,
  ],

  controllers: [AppController],
  providers: [AppService, GoogleAuthService],
  exports: [GoogleAuthService],
})
export class AppModule {}
