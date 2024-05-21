import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/swagger.config';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api');
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  await app.listen(+configService.get('APP_PORT') || 9000);
}

bootstrap();
