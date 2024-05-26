import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class VerifyEmailDto {
    @IsEmail({},{message: 'Invalid email'})
    @IsNotEmpty({message: 'Email is required'})
    @ApiProperty({example: 'muktar@gmail.com', type: 'string', description: 'The email of the user'})
    email: string;

    @IsNumber()
    @IsNotEmpty({message: 'otp is required'})
    @ApiProperty({example: 123456, type: 'number', description: 'The otp of the user provided by email'})
    otp: number;
}