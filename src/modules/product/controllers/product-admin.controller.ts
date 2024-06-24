import {
  Body,
  Controller,
  Delete,
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
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductAdminService } from '../providers/product-admin.service';

@ApiTags('Admin/Products')
@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  @ApiOkResponse({
    description: 'Product Created Successfully',
    type: ProductEntity,
  })
  @ApiOperation({ summary: 'Create Product' })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productAdminService.create(createProductDto);
  }

  // @Post('bulk')
  // @ApiOkResponse({description: 'Products Created Successfully', type: [ProductEntity]})
  // createBulk(@Body() createBulkProductsDto: CreateBulkProductsDto{
  //   return this.
  // }

  @ApiOkResponse({
    description: 'Product Updated Successfully',
    type: ProductEntity,
  })
  @ApiOperation({ summary: 'Update Product' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productAdminService.update(+id, updateProductDto);
  }

  @ApiOkResponse({ description: 'Deleted Successfully', type: ProductEntity })
  @ApiOperation({ summary: 'Delete Product' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedProduct = await this.productAdminService.delete(+id);
    return plainToInstance(ProductEntity, deletedProduct);
  }

  @Put('restore/:id')
  @ApiOperation({ summary: 'Restore Product' })
  @ApiOkResponse({ description: 'Restored Successfully', type: ProductEntity })
  restore(@Param('id') id: string) {
    return this.productAdminService.restore(+id);
  }
}
