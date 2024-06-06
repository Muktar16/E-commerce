import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class CreateBulkCategoriesDto {
  @ApiProperty({
    description: 'Array of categories to be created',
    type: [CreateCategoryDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  categories: CreateCategoryDto[];
}
