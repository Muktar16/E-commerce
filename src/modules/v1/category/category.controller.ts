import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/modules/shared/guards/role.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt') ,new RoleGuard(Roles.ADMIN))
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
  @UseGuards(AuthGuard('jwt') ,new RoleGuard(Roles.ADMIN))
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    console.log('updateCategoryDto', updateCategoryDto, id);
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard(Roles.ADMIN))
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
