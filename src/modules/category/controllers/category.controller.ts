import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/common/enums/user-roles.enum';
import { CategoryService } from '../providers/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN,Roles.SUPERADMIN]))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
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
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }

  @Get('restore/:id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  restore(@Param('id') id: string) {
    return this.categoryService.restore(+id);
  }

  @Get('items/:id')
  getItems(@Param('id') id: string) {
    return this.categoryService.getItems(+id);
  }
}
