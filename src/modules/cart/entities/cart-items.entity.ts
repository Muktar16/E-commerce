import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { TableNames } from "src/common/enums/table-names.enum";

@Entity(TableNames.CART_ITEMS)
export class CartItemEntity extends AbstractEntity<CartItemEntity>{
    @Column({ name: 'quantity', type: 'int', nullable: false })
    quantity: number;

    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn()
    public product: ProductEntity   

    @ManyToOne(() => CartEntity, (cart) => cart.id)
    @JoinColumn()
    public cart: CartEntity
}
