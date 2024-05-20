import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CartEntity } from "./cart.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";

@Entity({ name: 'cart_product', schema: 'ecommerce' })
export class CartProductEntity extends AbstractEntity<CartProductEntity>{
    @Column({ name: 'quantity', type: 'int', nullable: false })
    quantity: number;

    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn()
    public product: ProductEntity   

    @ManyToOne(() => CartEntity, (cart) => cart.id)
    @JoinColumn()
    public cart: CartEntity
}
