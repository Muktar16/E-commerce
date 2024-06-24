import { ApiProperty } from '@nestjs/swagger';
import { UpdateCategoryDto } from './update-category.dto';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { Expose } from 'class-transformer';

export class CategoryItemsResponseDto extends UpdateCategoryDto {
  @Expose()
  @ApiProperty({ type: ProductEntity, isArray: true })
  products: ProductEntity[];
}
