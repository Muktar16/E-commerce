import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { SignUpDto } from "./auth.signup.dto";

export class AdminSignUpDto extends SignUpDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'admin', type: 'string', description: 'The role of the user'})
    role: string;
}