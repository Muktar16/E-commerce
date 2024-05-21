import { Module } from '@nestjs/common';
import { ProductService } from './providers/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]),CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
