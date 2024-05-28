import { ApiProperty } from '@nestjs/swagger';
import { Expose, instanceToPlain } from 'class-transformer';
import { UserResponseDto } from 'src/shared/auth/dtos/user-response.dto';

export class AllUsersResponseDto {
  @Expose()
  @ApiProperty({ example: 100 })
  total: number;
  
  @Expose()
  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];
}
