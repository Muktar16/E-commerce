import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreatePromoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'PROMO10' })
  @Length(1, 100)
  code: string;

  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-06-11' })
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ example: '2024-06-15' })
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ required: true, description: 'User IDs', example: [1, 2, 3] })
  @IsNumber({}, { each: true })
  @IsOptional()
  applicableUsers: number[];
}
