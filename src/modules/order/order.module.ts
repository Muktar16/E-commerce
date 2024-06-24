import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { AdminOrderController } from './controllers/admin-order.controller';
import { UserOrderController } from './controllers/user-order.controller';
import { OrderEntity } from './entities/order.entity';
import { AdminOrderService } from './providers/admin-order.service';
import { UserOrderService } from './providers/user-order.service';
import { PromoModule } from '../promo/promo.module';
import { DiscountModule } from '../discount/discount.module';
import { UserPromoEntity } from '../promo/entities/user_promos.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, UserPromoEntity]),
    CartModule,
    UserModule,
    ProductModule,
    PromoModule,
    DiscountModule,
  ],
  controllers: [UserOrderController, AdminOrderController],
  providers: [UserOrderService, AdminOrderService],
})
export class OrderModule {}
