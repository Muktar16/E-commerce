// category.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Import the TypeOrmModule and specify the Category entity
  providers: [CategoryService], // Add CategoryService as a provider
  controllers: [CategoryController], // Add CategoryController
})
export class CategoryModule {}
