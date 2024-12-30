import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Validator } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
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
    methods: '*',  // Métodos permitidos
    allowedHeaders: '*',  // Encabezados permitidos
    credentials: true,  // Si necesitas enviar cookies
  }));
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();