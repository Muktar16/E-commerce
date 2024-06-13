import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger/swagger.config';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Setup Swagger
  setupSwagger(app);

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: false,
  }));

  // Use global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies to be sent with the requests
  });

  // // Use cookie parser middleware
  // app.use(cookieParser());

  // // Use CSRF protection middleware
  // app.use(csurf({
  //   cookie: {
  //     httpOnly: true,
  //     secure: configService.get('NODE_ENV') === 'production', // Use secure cookies in production
  //     sameSite: 'strict',
  //   },
  // }));

  // Start the application
  await app.listen(+configService.get('APP_PORT') || 9000);
}

bootstrap();
