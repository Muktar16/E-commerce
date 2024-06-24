import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Category } from '../entities/category.entity';
import { CategoryAdminService } from '../providers/category-admin.service';
import { CategoryItemsResponseDto } from '../dtos/category-items-response.dto';
import { CreateBulkCategoriesDto } from '../dtos/create-bulk-category.dto';

@ApiTags('Admin/Categories')
@ApiBearerAuth()
@Controller('admin/categories')
export class CategoryAdminController {
  constructor(private readonly categoryAdminService: CategoryAdminService) {}

  @Post()
  @ApiOkResponse({
    description: 'Category Created Successfully',
    type: Category,
  })
  @ApiOperation({ summary: 'Create Category' })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const cat = await this.categoryAdminService.create(createCategoryDto);
    return plainToInstance(Category, cat);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create Bulk Categories' })
  @ApiOkResponse({
    description: 'Categories Created Successfully',
    type: [Category],
  })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  async createBulk(
    @Body() createBulkCategoriesDto: CreateBulkCategoriesDto, // Array of CreateCategoryDto
  ): Promise<Category[]> {
    const categories = await this.categoryAdminService.createBulk(
      createBulkCategoriesDto,
    );
    return plainToInstance(Category, categories);
  }

  // @Get()
  // @ApiOkResponse({ description: 'List of all Categories', type: [Category] })
  // findAll() {
  //   return this.categoryAdminService.findAll();
  // }

  // @Get(':id')
  // @ApiOkResponse({ description: 'Category Details', type: Category })
  // findOne(@Param('id') id: string) {
  //   return this.categoryService.findOne(+id);
  // }

  @Put(':id')
  @ApiOperation({ summary: 'Update Category' })
  @ApiOkResponse({
    description: 'Category Updated Successfully',
    type: Category,
  })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryAdminService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Category' })
  @ApiOkResponse({ description: 'Category Deleted Successfully' })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  async delete(@Param('id') id: string): Promise<string> {
    return await this.categoryAdminService.delete(+id);
  }

  @Put('restore/:id')
  @ApiOperation({ summary: 'Restore Category' })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  async restore(@Param('id') id: string): Promise<string> {
    return await this.categoryAdminService.restore(+id);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get Category Items' })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  @ApiOkResponse({
    description: 'Category Items',
    type: CategoryItemsResponseDto,
  })
  async getItems(@Param('id') id: string): Promise<CategoryItemsResponseDto> {
    const categoryItems = await this.categoryAdminService.getItems(+id);
    return plainToInstance(CategoryItemsResponseDto, categoryItems);
  }
}
