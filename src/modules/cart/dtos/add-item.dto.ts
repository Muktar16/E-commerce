import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddItemDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsNumber()
  @ApiProperty({
    example: 1,
    type: 'number',
    description: 'Product ID is required',
  })
  productId: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber()
  @ApiProperty({
    example: 5,
    type: 'decimal',
    description: 'Quantity is required',
  })
  quantity: number;
}
