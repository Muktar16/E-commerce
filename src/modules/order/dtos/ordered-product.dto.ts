import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrderedProduct {
  @Expose()
  @ApiProperty({ example: 1 })
  productId: number;

  @Expose()
  @ApiProperty({ example: 2 })
  quantity: number;

  @Expose()
  @ApiProperty({ example: 50 })
  price: number;

  @Expose()
  @ApiProperty({ example: 10 })
  discount: number;

  @Expose()
  @ApiProperty({ example: 45 })
  priceAfterDiscount: number;

  @Expose()
  @ApiProperty({ example: 'PERCENTAGE' })
  discountType: string;
}
