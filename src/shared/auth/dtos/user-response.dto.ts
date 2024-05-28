import { ApiProperty } from '@nestjs/swagger';
import { Expose, instanceToPlain } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
    type: 'number',
    description: 'The id of the user',
  })
  id: number;

  @Expose()
  @ApiProperty({
    example: 'John Doe',
    type: 'string',
    description: 'The name of the user',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'bsse1116@gmail.com',
    type: 'string',
    description: 'The email of the user',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: 'user/admin/delivery-personnel',
    type: 'string',
    description: 'The role of the user',
  })
  role: string;

  @Expose()
  @ApiProperty({
    example: '+8801712345678',
    type: 'string',
    description: 'The phone number of the user',
  })
  phoneNumber: string;

  @Expose()
  @ApiProperty({
    example: false,
    type: 'boolean',
    description: 'The verification status of the user',
  })
  isVerified: boolean;

  toJSON() {
    return instanceToPlain(this);
  }
}


