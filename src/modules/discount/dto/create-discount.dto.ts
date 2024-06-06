import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsString, Max, Min, ValidateIf } from 'class-validator';

const MAX_FLAT_AMOUNT = 500;

export class CreateDiscountDto {
  @ApiProperty({ 
    description: 'Discount name', 
    example: 'Summer Sale',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Discount type', 
    enum: ['flat', 'percentage'],
    example: 'percentage'
  })
  @IsString()
  @IsIn(['flat', 'percentage'])
  type: string;

  @ApiProperty({ 
    description: 'Discount value', 
    example: 20
  })
  @IsNumber()
  @IsNotEmpty()
//   @Min(0,{message: 'Discount value cannot be less than 0'})
//   @ValidateIf((o) => o.type === 'percentage')
//   @Max(100, { message: 'Percentage discount cannot be more than 100%' })
//   @ValidateIf((o) => o.type === 'flat')
//   @Max(MAX_FLAT_AMOUNT, { message: `Flat discount cannot be more than ${MAX_FLAT_AMOUNT}` })
  @Type(() => Number)
  value: number;

  @ApiProperty({ 
    description: 'Discount start date',  
    example: '2023-01-01'
  })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ 
    description: 'Discount end date', 
    example: '2023-12-31'
  })
  @IsDateString()
  validTo: string;
}
