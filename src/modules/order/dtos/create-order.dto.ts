import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Shipping Address is required' })
  @ApiProperty({
    example: '123 Main St, New York, NY 10030',
    type: 'string',
    description: 'Shipping Address is required',
  })
  shippingAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Contact Number is required' })
  @ApiProperty({
    example: '+880151892796',
    type: 'string',
    description: 'Contact Number is required',
  })
  contactNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'PROMO10',
    type: 'string',
    description: 'Promo Code(optional)',
  })
  promoCode: string;
}
