import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardsModule } from '../shared/guards/guards.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

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
        schema: configService.get<string>('DB_SCHEMA'),
        migrations:['dist/migrations/*{.ts,.js}'],
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    GuardsModule,
    OrderModule,
    UserModule,
    CartModule,
    CategoryModule,
    ProductModule,
  ],
})
export class ModulesModule {}
