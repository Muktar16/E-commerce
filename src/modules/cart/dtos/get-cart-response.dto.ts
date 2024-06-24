import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CartResponseDto {
  @Expose()
  @ApiProperty({ type: 'number', description: 'Cart ID', example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ type: 'number', description: 'User ID', example: 1 })
  userId: number;

  @Expose()
  @ApiProperty({
    type: 'array',
    description: 'Cart Items',
    example: [
      {
        id: 1,
        quantity: 2,
        product: {
          id: 1,
          name: 'Product 1',
          price: 100,
          description: 'Product 1 description',
          createdAt: '2021-09-01T00:00:00.000Z',
          updatedAt: '2021-09-01T00:00:00.000Z',
        },
      },
    ],
  })
  cartItems: any[];

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Cart creation date',
    example: '2021-09-01T00:00:00.000Z',
  })
  createdAt: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Cart last update date',
    example: '2021-09-01T00:00:00.000Z',
  })
  updatedAt: string;
}
