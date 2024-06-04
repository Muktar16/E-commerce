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
