import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderedProduct } from '../dtos/ordered-product.dto';
import { OrderInvoice } from '../dtos/ordered-invoice.dto';
import { Expose } from 'class-transformer';

@Entity(TableNames.ORDERS)
export class OrderEntity extends AbstractEntity<OrderEntity> {
  @Expose()
  @Column({
    name: 'order_status',
    type: 'text',
    nullable: false,
    default: OrderStatus.Pending,
  })
  orderStatus: string;

  @Expose()
  @Column({ name: 'shipping_address', type: 'text', nullable: false })
  shippingAddress: string;

  @Expose()
  @Column({ name: 'contact_number', type: 'text', nullable: false })
  contactNumber: string;

  @Expose()
  @Column({
    name: 'order_date',
    type: 'timestamp without time zone',
    nullable: false,
  })
  orderDate: Date;

  @Expose()
  @Column({ name: 'products', type: 'jsonb', nullable: false })
  products: OrderedProduct[];

  @Expose()
  @Column({ name: 'order_invoice', type: 'jsonb', nullable: false })
  orderInvoice: OrderInvoice;

  @Expose()
  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn()
  user: UserEntity;
}
