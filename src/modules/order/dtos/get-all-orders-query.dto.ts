import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    IsDateString,
    IsEnum,
    IsInt,
    IsOptional,
    Min
} from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class GetAllOrdersQueryDto {
  @Expose()
  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiProperty({ example: OrderStatus.Pending, enum: OrderStatus, required: false})
  orderStatus?: OrderStatus;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2024-06-11',required: false })
  dateFrom?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2024-06-15',required: false })
  dateTo?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ example: 1,required: false })
  userId?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 10 ,required: false})
  @Type(() => Number)
  limit?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ example: 10,required: false })
  @Type(() => Number)
  offset?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1 ,required: false})
  @Type(() => Number)
  page?: number;

  @Expose()
  @ApiProperty({ example: 10 , required: false})
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  size?: number;
}
