import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from 'src/modules/order/enums/order-status.enum';

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Update Status is required' })
  @ApiProperty({
    example: `${Object.values(OrderStatus).join('/')}`,
    type: 'string',
    description: 'Status is required',
  })
  status: string;
}
