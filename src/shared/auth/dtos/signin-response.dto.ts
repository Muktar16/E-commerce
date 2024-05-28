import { ApiProperty } from '@nestjs/swagger';
import { Expose, instanceToPlain } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class SignInResponseDto {
  @Expose()
  @ApiProperty({ type: instanceToPlain(UserResponseDto) })
  user: UserResponseDto;

  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}
