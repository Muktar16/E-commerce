import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import * as moment from 'moment';

const MAX_FLAT_AMOUNT = 5000;

export class CreateDiscountDto {
  @ApiProperty({
    description: 'Discount name',
    example: 'Summer Sale',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Discount type',
    enum: ['flat', 'percentage'],
    example: 'percentage',
  })
  @IsString()
  @IsIn(['flat', 'percentage'])
  type: string;

  @ApiProperty({ description: 'Discount value', example: 20 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Discount value cannot be less than 0' })
  @Max(MAX_FLAT_AMOUNT, {
    message: `Flat discount cannot exceed ${MAX_FLAT_AMOUNT}`,
  })
  @ValidateIf((object) => object.type === 'percentage')
  @Max(100, { message: 'Percentage discount cannot exceed 100' })
  value: number;

  @ApiProperty({ description: 'Discount start date', example: '2023-01-01' })
  @IsDateString()
  @ValidateIf((object) =>
    moment(object.validFrom).isBefore(moment(object.validTo), 'day'),
  )
  validFrom: string;

  @ApiProperty({ description: 'Discount end date', example: '2023-12-31' })
  @IsDateString()
  @ValidateIf((object) =>
    moment(object.validTo).isAfter(moment(object.validFrom), 'day'),
  ) // Corrected validation logic
  validTo: string;

  @ApiProperty({ description: 'Product IDs', example: [1, 2, 3] })
  @IsNumber({}, { each: true })
  @IsOptional()
  productIds: number[];
}
