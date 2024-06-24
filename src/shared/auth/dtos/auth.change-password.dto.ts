import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString, isEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Current Password is required' })
  @ApiProperty({
    example: '*******',
    type: 'string',
    description: 'Current Password',
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New Password is required' })
  @ApiProperty({
    example: '*******',
    type: 'string',
    description: 'New Password',
  })
  newPassword: string;
}
