import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Validator } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cors({
    origin: '*',  // URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Métodos permitidos
    allowedHeaders: 'Content-Type, Accept, Authorization',  // Encabezados permitidos
    credentials: true,  // Si necesitas enviar cookies
  }));
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();