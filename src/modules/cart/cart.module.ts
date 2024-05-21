import { Module } from '@nestjs/common';
import { CartService } from './providers/cart.service';
import { CartController } from './controllers/cart.controller';
import { CartEntity } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { CartItemEntity } from './entities/cart-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity]), ProductModule, UserModule],
  controllers: [ CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
