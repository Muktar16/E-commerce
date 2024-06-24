import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrderInvoice {
  @Expose()
  @ApiProperty({ example: 100 })
  itemsSubTotal: number;

  @Expose()
  @ApiProperty({ example: 90 })
  itemsSubTotalAfterDiscount: number;

  //   @Expose()
  //   @ApiProperty({ example: 140 })
  //   totalOrderAmount: number;

  @Expose()
  @ApiProperty({ example: 40 })
  deliveryCharge: number;

  @Expose()
  @ApiProperty({ example: 'PROMO10', nullable: true })
  promoCode?: string;

  @Expose()
  @ApiProperty({ example: 10, nullable: true })
  promoDiscount?: number;

  @Expose()
  @ApiProperty({ example: 130 })
  totalOrderAmountAfterDiscount?: number;

  @Expose()
  @ApiProperty({ example: 170 })
  totalPayableAmount: number;
}
