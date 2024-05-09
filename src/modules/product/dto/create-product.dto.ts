import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @ApiProperty({example: 'Trimmer', type: 'string', description: 'The name of the product'})
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: 'This is a nice trimmer', type: 'string', description: 'The description of the product'})
    @IsNotEmpty()
    description: string;

    @ApiProperty({example: 100, type: 'number', description: 'The price of the product'})
    @IsNotEmpty()
    price: number;

    @ApiProperty({example: 10, type: 'number', description: 'The stock quantity of the product'})
    @IsNotEmpty()
    stockQuantity: number;

    @ApiProperty({example: 'Electronics', type: 'string', description: 'The category of the product'})
    @IsNotEmpty()
    category: string;

    @ApiProperty({example: ['image1.jpg', 'image2.jpg'], type: 'array', description: 'The images of the product'})
    @IsNotEmpty()
    images: string[];
}
