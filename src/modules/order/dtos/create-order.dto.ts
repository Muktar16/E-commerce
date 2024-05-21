import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderedProduct } from 'src/common/interfaces/ordered-product.interface';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Shipping Address is required' })
  @ApiProperty({
    example: '123 Main St, New York, NY 10030',
    type: 'string',
    description: 'Shipping Address is required',
  })
  shippingAddress: string;
}
