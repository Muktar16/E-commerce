import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from '../entities/category.entity';
import { CategoryGeneralService } from '../providers/category-general.service';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryGeneralController {
  constructor(private readonly categoryService: CategoryGeneralService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({ description: 'List of all Categories', type: [Category] })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiOkResponse({ description: 'Category Details', type: Category })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
}
