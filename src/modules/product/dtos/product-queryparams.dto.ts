import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsOptional } from 'class-validator';

export class ProductFindAllQueryParamsDto {
  @ApiProperty({
    example: 1,
    type: 'number',
    description: 'Page no of the product list',
  })
  @IsOptional()
  @IsEmpty()
  page?: number;

  @ApiProperty({
    example: 10,
    type: 'number',
    description: 'Number of products per page',
  })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({
    example: 'Search product name',
    type: 'string',
    description: 'Sort by field',
  })
  @IsOptional()
  name?: string;
}
