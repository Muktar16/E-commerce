import { Exclude } from "class-transformer";
import { IsOptional } from "class-validator";
import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderEntity } from "../../order/entities/order.entity";

@Entity({name: 'user', schema: 'ecommerce'})
export class UserEntity extends AbstractEntity<UserEntity>{
    @Column({name: 'name', type: 'text'})
    name: string;

    @Column({name: 'email', type: 'text', unique: true})
    email: string;

    @Column({name: 'password', type: 'text', select: false})
    password: string;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'phone_number', nullable: true })
    phoneNumber: string;

    @Exclude()
    @IsOptional()
    @Column({ name: 'otp', nullable: true })
    otp: number;

    @Exclude()
    @Column({ name: 'reset_password_token',type:'text', nullable: true})
    @IsOptional()
    resetPasswordToken: string;

    @Exclude()
    @Column({ name: 'token_expiry', nullable: true })
    @IsOptional()
    tokenExpiry: Date;

    @Column({name: 'role', type: 'text', default: Roles.USER})
    role: string;

    @OneToOne(() => CartEntity, cart => cart.user)
    cart: CartEntity; // Define the one-to-one relation

    @OneToMany(() => OrderEntity, order => order.id)
    orders: OrderEntity[];
}
