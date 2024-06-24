import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ApplyDiscountDto {
  @ApiProperty({
    description: 'Discount id',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  discountId: number;

  @ApiProperty({
    required: true,
    description: 'Product IDs',
    example: [1, 2, 3],
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  productIds: number[];
}
