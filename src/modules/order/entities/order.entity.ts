import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { OrderedProduct } from "src/utility/interfaces/ordered-product.interface";
import { OrderStatus } from "src/utility/common/order-status.enum";

@Entity({ name: 'order', schema: 'ecommerce' })
export class OrderEntity extends AbstractEntity<OrderEntity>{
    
    @Column({ name: 'total_amount', type: 'float', nullable: false })
    totalAmount: number;

    @Column({ name: 'order_status', type: 'text', nullable: false, default: OrderStatus.Pending})
    orderStatus: string;

    @Column({ name: 'shipping_address', type: 'text', nullable: false })
    shippingAddress: string;

    @Column({name: 'products', type: 'jsonb', nullable: false})
    products: OrderedProduct[];

    @Column({ name: 'order_date', type: 'timestamp without time zone', nullable: false })
    orderDate: Date;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn()
    public user: UserEntity;
}
