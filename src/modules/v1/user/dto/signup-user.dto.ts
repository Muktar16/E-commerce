import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class SignupUserDto {
    @IsString()
    @IsNotEmpty({message: 'Name is required'})
    @ApiProperty({example: 'John Doe', type: 'string', description: 'The name of the user'})
    name: string;

    @IsEmail({}, {message: 'Invalid email'})
    @IsNotEmpty({message: 'Email is required'})
    @ApiProperty({example: 'muktar.hosen@brainstation-23.com', type: 'string', description: 'The email of the user'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'Password is required'})
    @ApiProperty({example: '123456', type: 'string', description: 'The password of the user'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    password: string;
}