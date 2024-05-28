import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { Category } from '../entities/category.entity';
import { CategoryService } from '../providers/category.service';
import { CategoryItemsResponseDto } from '../dtos/category-items-response.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOkResponse({ description: 'Category Created Successfully', type: Category})
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN,Roles.SUPERADMIN]))
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category>{
    const cat = await this.categoryService.create(createCategoryDto);
    return plainToInstance(Category, cat);
  }

  @Get()
  @ApiOkResponse({ description: 'List of all Categories', type: [Category]})
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Category Details', type: Category})
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  async delete(@Param('id') id: string): Promise<string>{
    return await this.categoryService.delete(+id);
  }

  @Put('restore/:id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  async restore(@Param('id') id: string): Promise<string>{
    return await this.categoryService.restore(+id);
  }

  @Get('items/:id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  @ApiOkResponse({ description: 'Category Items', type: CategoryItemsResponseDto})
  async getItems(@Param('id') id: string): Promise<CategoryItemsResponseDto>{
    const categoryItems = await this.categoryService.getItems(+id);
    console.log({categoryItems});
    return plainToInstance(CategoryItemsResponseDto, categoryItems);
  }
}
