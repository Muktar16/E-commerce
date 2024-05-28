import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: 'string' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: 'string' })
  description?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  sku?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'number',
  })
  categoryId?: number;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string',
  })
  search?: string;
}
