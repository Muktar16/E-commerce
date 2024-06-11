import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';
// import { OrderedProduct } from 'src/common/interfaces/ordered-product.interface';
// import { OrderInvoice } from 'src/common/interfaces/order-invoice.interface';
import { Expose, Type } from 'class-transformer';
import { OrderedProduct } from './ordered-product.dto';
import { OrderInvoice } from './ordered-invoice.dto';

export class CreateOrderResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: OrderStatus.Pending })
  orderStatus: string;

  @Expose()
  @ApiProperty({ example: '123 Main St' })
  shippingAddress: string;

  @Expose()
  @ApiProperty({ example: '+123456789' })
  contactNumber: string;

  @Expose()
  @ApiProperty({ example: '2024-06-11T00:00:00.000Z' })
  orderDate: Date;

  @Expose()
  @Type(() => OrderedProduct)
  @ApiProperty({ type: [OrderedProduct] })
  products: OrderedProduct[];

  @Expose()
  @Type(() => OrderInvoice)
  @ApiProperty({ type: OrderInvoice })
  orderInvoice: OrderInvoice;

  @Expose()
  @ApiProperty({ example: 1 })
  userId: number;
}
