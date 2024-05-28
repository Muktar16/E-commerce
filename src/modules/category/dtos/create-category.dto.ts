import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {

  @ApiProperty({ description: 'The name of the category', example: 'Electronics'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the category', example: 'Electronics category description'})
  @IsNotEmpty()
  @IsString()
  description: string;
}

