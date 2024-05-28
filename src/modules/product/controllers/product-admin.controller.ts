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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductAdminService } from '../providers/product-admin.service';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Admin/Product')
@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  @ApiOkResponse({
    description: 'Product Created Successfully',
    type: ProductEntity,
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productAdminService.create(createProductDto);
  }

  @ApiOkResponse({
    description: 'Product Updated Successfully',
    type: ProductEntity,
  })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productAdminService.update(+id, updateProductDto);
  }

  @ApiOkResponse({description: 'Deleted Successfully', type: ProductEntity})
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedProduct = await this.productAdminService.delete(+id);
    return plainToInstance(ProductEntity, deletedProduct);
  }

  @Put('restore/:id')
  
  restore(@Param('id') id: string) {
    return this.productAdminService.restore(+id);
  }
}
