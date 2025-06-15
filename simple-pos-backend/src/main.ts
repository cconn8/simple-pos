import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('NODE_ENV is:', process.env.NODE_ENV);
  console.log(`Loading env file: .env.${process.env.NODE_ENV}`);


  app.enableCors();
  await app.listen(3005);
}
bootstrap();
