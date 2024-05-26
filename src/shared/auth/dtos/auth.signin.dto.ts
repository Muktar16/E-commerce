import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty({message: 'Email is required'})
    @ApiProperty({example: 'muktarmridha6@gmail.com', type: 'string', description: 'The email of the user'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'Password is required'})
    @ApiProperty({example: '123456', type: 'string', description: 'The password of the user'})
    password: string;
}