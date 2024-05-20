import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { GuardsModule } from '../shared/guards/guards.module';

@Module({
  imports: [
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
        migrations:['dist/migrations/*{.ts,.js}'],
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    SharedModule,
    GuardsModule,
  ],
})
export class ModulesModule {}
