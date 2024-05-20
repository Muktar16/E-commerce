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

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]),CartModule, UserModule, ProductModule],
  controllers: [UserOrderController, AdminOrderController],
  providers: [UserOrderService, AdminOrderService],
})
export class OrderModule {}
