import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;  // Default to 3000 if process.env.PORT is undefined

  // Serve static files
  app.use('/public', express.static(join(__dirname, '..', 'public')));

  await app.listen(port);
}
bootstrap();
