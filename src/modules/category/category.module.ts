import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryAdminService } from './providers/category-admin.service';
import { CategoryAdminController } from './controllers/category-admin.controller';
import { CategoryGeneralController } from './controllers/category-general.controller';
import { CategoryGeneralService } from './providers/category-general.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], 
  providers: [CategoryGeneralService, CategoryAdminService], 
  controllers: [CategoryAdminController, CategoryGeneralController],
  exports: [CategoryAdminService, CategoryGeneralService],
})

export class CategoryModule {}
