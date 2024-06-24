import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GuardsModule } from '../shared/guards/guards.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PromoModule } from './promo/promo.module';
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
    PromoModule,
    DiscountModule,
  ],
})
export class ModulesModule {}
