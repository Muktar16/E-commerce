import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PromoQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['running', 'ended', 'not-started'])
  @ApiPropertyOptional({
    description: 'Filter promos by status',
    enum: ['running', 'ended', 'not-started'],
  })
  status?: 'running' | 'ended' | 'not-started';
}
