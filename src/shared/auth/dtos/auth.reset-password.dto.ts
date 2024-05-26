import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto{
    @IsNotEmpty({message: 'New Password is required'})
    @IsString()
    @ApiProperty({example: '123456', type: 'string', description: 'The password of the user'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    newPassword:string;

    @IsNotEmpty({message: 'Token is required'})
    @IsString()
    @ApiProperty({example: 'f9aa43d6691c3fd91fa22cca74259d6d9c2324d6ef61de7bcf3ee65df5d618fe', type: 'string', description: 'The token'})
    token:string;
}