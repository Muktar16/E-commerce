import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { CategoryGeneralService } from '../providers/category-general.service';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryGeneralController {
  constructor(private readonly categoryService: CategoryGeneralService) {}

  @Get()
  @ApiOkResponse({ description: 'List of all Categories', type: [Category] })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Category Details', type: Category })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
}
