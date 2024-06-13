import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PaginatedDataResponseDto {
  @Expose()
  total?: number;

  @Expose()
  data?: any;
}