import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductModule, UserModule, OrderModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class V1Module {}
