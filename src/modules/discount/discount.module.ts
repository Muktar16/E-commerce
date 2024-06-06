import { Module } from '@nestjs/common';
import { DiscountAdminController } from './controllers/discount-admin.controller';
import { DiscountAdminService } from './providers/discount-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  controllers: [DiscountAdminController],
  providers: [DiscountAdminService],
})
export class DiscountModule {}
