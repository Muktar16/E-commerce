import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderedProduct } from 'src/common/interfaces/ordered-product.interface';
import { OrderStatus } from '../enums/order-status.enum';
import { TableNames } from 'src/common/enums/table-names.enum';
import { PromoEntity } from '../../promo/entities/promo.entity';
import { AbstractEntity } from 'src/common/entities/abstract.entity';

@Entity(TableNames.ORDERS)
export class OrderEntity extends AbstractEntity<OrderEntity> {
  @Column({ name: 'total_amount', type: 'float', nullable: false })
  totalAmount: number;

  @Column({ name: 'order_status', type: 'text', nullable: false, default: OrderStatus.Pending })
  orderStatus: string;

  @Column({ name: 'shipping_address', type: 'text', nullable: false })
  shippingAddress: string;

  @Column({ name: 'products', type: 'jsonb', nullable: false })
  products: OrderedProduct[];

  @Column({ name: 'order_date', type: 'timestamp without time zone', nullable: false })
  orderDate: Date;

  @ManyToOne(() => UserEntity, user => user.orders)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => PromoEntity)
  @JoinColumn()
  promo: PromoEntity;

  @Column({ name: 'discount_amount', type: 'float', default: 0 })
  discountAmount: number;
}

