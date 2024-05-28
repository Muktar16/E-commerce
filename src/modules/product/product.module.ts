import { Module } from '@nestjs/common';
import { ProductGeneralService } from './providers/product-general.service';
import { ProductGeneralController } from './controllers/product-general.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ProductAdminService } from './providers/product-admin.service';
import { ProductAdminController } from './controllers/product-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]),CategoryModule],
  controllers: [ProductGeneralController, ProductAdminController],
  providers: [ProductGeneralService, ProductAdminService],
  exports: [ProductGeneralService],
})
export class ProductModule {}
