import { Exclude } from "class-transformer";
import { IsOptional } from "class-validator";
import { AbstractEntity } from "src/common/entities/abstract.entity";
import { TableNames } from "src/common/enums/table-names.enum";
import { Roles } from "src/common/enums/user-roles.enum";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { CartEntity } from "../../cart/entities/cart.entity";
import { OrderEntity } from "../../order/entities/order.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity(TableNames.USERS)
export class UserEntity extends AbstractEntity<UserEntity>{
    @Column({name: 'name', type: 'text'})
    name: string;

    @Column({name: 'email', type: 'text', unique: true})
    email: string;

    @Column({name: 'password', type: 'text', select: false})
    password: string;

    @Exclude()
    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;

    @Column({ name: 'phone_number', nullable: true, unique: true})
    phoneNumber: string;

    @Exclude()
    @IsOptional()
    @Column({ name: 'otp', nullable: true })
    otp: number;

    @Exclude()
    @Column({ name: 'otp_created_at', nullable: true })
    @IsOptional()
    otpCreatedAt: Date;

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
    cart: CartEntity;

    @OneToMany(() => OrderEntity, order => order.id)
    orders: OrderEntity[];
}
