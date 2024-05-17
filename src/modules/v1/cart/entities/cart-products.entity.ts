import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartEntity } from "./cart.entity";

@Entity({ name: 'cart_product', schema: 'ecommerce' })
export class CartProductEntity extends AbstractEntity<CartProductEntity>{
    @Column({ name: 'quantity', type: 'int', nullable: false })
    quantity: number;

    // @Column({ name: 'product_id', nullable: false})
    // product_id: number;

    // @Column({ name: 'cart_id', nullable: false})
    // cart_id: number;

    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn()
    public product: ProductEntity   

    @ManyToOne(() => CartEntity, (cart) => cart.id)
    @JoinColumn()
    public cart: CartEntity
}
