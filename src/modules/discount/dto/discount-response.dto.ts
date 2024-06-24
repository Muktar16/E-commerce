import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DiscountResponseDto {
  @ApiProperty({ description: 'Discount ID' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Discount name' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Discount type', enum: ['flat', 'percentage'] })
  @Expose()
  type: string;

  @ApiProperty({ description: 'Discount value', type: 'number' })
  @IsNumber()
  @Expose()
  value: number;

  @ApiProperty({ description: 'Discount start date' })
  @Expose()
  validFrom: string;

  @ApiProperty({ description: 'Discount end date' })
  @Expose()
  validTo: string;

  @ApiProperty({ description: 'Product IDs', example: [1, 2, 3] })
  @Expose()
  productIds: number[];
}
