import { Expose } from 'class-transformer';
import { ProductEntity } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AllProductResponseDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Total number of products',
    example: 10,
  })
  total: number;

  @Expose()
  @ApiProperty({ type: [ProductEntity], description: 'List of products' })
  products: ProductEntity[];
}
