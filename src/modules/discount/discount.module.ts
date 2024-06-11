import { Module } from '@nestjs/common';
import { DiscountAdminController } from './controllers/discount-admin.controller';
import { DiscountAdminService } from './providers/discount-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity]), ProductModule],
  controllers: [DiscountAdminController],
  providers: [DiscountAdminService],
  exports: [DiscountAdminService],
})
export class DiscountModule {}
