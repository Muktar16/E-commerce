import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SignUpDto } from './auth.signup.dto';
import { SpecialUserRoles } from 'src/common/enums/user-roles.enum';

export class SpecialSignUpDto extends SignUpDto {
  @IsEnum(SpecialUserRoles)
  @IsNotEmpty()
  @ApiProperty({
    type: 'enum',
    enum: SpecialUserRoles,
    description: 'The role of the user',
    default: SpecialUserRoles.DELIVERYPERSONNEL,
  })
  role: SpecialUserRoles;
}
