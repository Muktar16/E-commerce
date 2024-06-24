import { Expose } from 'class-transformer';

export class PaginatedDataResponseDto {
  @Expose()
  total?: number;

  @Expose()
  data?: any;
}
