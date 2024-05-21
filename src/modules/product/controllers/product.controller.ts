import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/common/enums/user-roles.enum';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductService } from '../providers/product.service';
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN,Roles.SUPERADMIN]))
  create(@Body() createProductDto: CreateProductDto){
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() queryParams: any){
    return this.productService.findAll(queryParams);
  }

  @Get('deleted')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  getDeleted() {
    return this.productService.getDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Get('restore/:id')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  restore(@Param('id') id: string) {
    return this.productService.restore(+id);
  }

  
}
