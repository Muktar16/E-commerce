import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SignUpDto } from './auth.signup.dto';

enum SpecialRoles {
  ADMIN = 'admin',
  DELIVERYPERSON = 'deliveryperson',
}

export class SpecialSignUpDto extends SignUpDto {
  @IsEnum(SpecialRoles)
  @IsNotEmpty()
  @ApiProperty({
    type: 'enum',
    enum: SpecialRoles,
    description: 'The role of the user',
    default: SpecialRoles.DELIVERYPERSON,
  })
  role: SpecialRoles;
}
