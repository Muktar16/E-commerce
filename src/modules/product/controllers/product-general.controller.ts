import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterProductDto } from '../dtos/filter-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductGeneralService } from '../providers/product-general.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { AllProductResponseDto } from '../dtos/all-product-response.dto';
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductGeneralController {
  constructor(private readonly productService: ProductGeneralService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of all Products',
    type: AllProductResponseDto,
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterProductDto: FilterProductDto,
  ): Promise<AllProductResponseDto> {
    const products = await this.productService.findAll(
      filterProductDto,
      paginationDto,
    );
    return plainToInstance(AllProductResponseDto, products);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Product Response', type: ProductEntity })
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return plainToInstance(ProductEntity, await this.productService.findOne(+id));
  }
}
