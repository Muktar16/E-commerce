import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  limit?: number;
}
