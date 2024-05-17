import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { ProductEntity } from "../../product/entities/product.entity";
import { CartProductEntity } from "./cart-products.entity";

@Entity({ name: 'cart', schema: 'ecommerce' })
export class CartEntity extends AbstractEntity<CartEntity>{

    @Column({ name: 'user_id'})
    userId: number;
    
    @OneToOne(() => UserEntity, user => user.id)
    @JoinColumn({name:'user_id'})
    user: UserEntity; // Define the one-to-one relation

    @OneToMany(() => CartProductEntity, cartProduct => cartProduct.cart)
    @JoinColumn()
    public cartProducts: CartProductEntity[];
}
