import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { SharedModule } from './shared/shared.module';
import { LoggingModule } from './shared/logging/logging.module';
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        schema: configService.get<string>('DB_SCHEMA'),
        migrations:['dist/migrations/*{.ts,.js}'],
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    
    ModulesModule,
    SharedModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_FILTER', useClass: AllExceptionsFilter },
    { provide: 'APP_INTERCEPTOR', useClass: TransformInterceptor },
  ],
})
export class AppModule {}
