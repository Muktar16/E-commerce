import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @Expose()
    @ApiProperty({example: 'Trimmer', type: 'string', description: 'The name of the product'})
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({example: 'This is a nice trimmer', type: 'string', description: 'The description of the product'})
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({example: '2314', type: 'string', description: 'The unique sku of the product'})
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiProperty({example: 100, type: 'number', description: 'The price of the product'})
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({example: 10, type: 'number', description: 'The stock quantity of the product'})
    @IsNotEmpty()
    @IsNumber()
    stockQuantity: number;

    @ApiProperty({example: 12, type: 'number', description: 'The category of the product'})
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @ApiProperty({example: ['image1.jpg', 'image2.jpg'], type: 'array', description: 'The images of the product'})
    @IsNotEmpty()
    images: string[];
}
