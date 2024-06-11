import { ApiProperty } from '@nestjs/swagger';

export class MyPromosResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 0 })
  usageCount: number;

  @ApiProperty({
    type: 'array',
    example: [
      {
        id: 3,
        code: 'PROMO11',
        discountPercentage: '10.00',
        startDate: '2024-06-11T00:00:00.000Z',
        endDate: '2024-06-15T00:00:00.000Z',
        usageLimit: null,
      },
    ],
  })
  promo: [object];
}
