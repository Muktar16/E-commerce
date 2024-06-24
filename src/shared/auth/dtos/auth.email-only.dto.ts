import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailOnlyDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({
    example: 'bsse1116@iit.du.ac.bd',
    type: 'string',
    description: 'Email is required',
  })
  email: string;
}
