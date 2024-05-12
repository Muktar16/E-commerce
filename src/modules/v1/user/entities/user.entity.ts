import { Exclude } from "class-transformer";
import { IsOptional } from "class-validator";
import { AbstractEntity } from "src/common/entities/abstract.entity";
import { Roles } from "src/utility/common/user-roles.enum";
import { Column, Entity } from "typeorm";

@Entity({name: 'user', schema: 'ecommerce'})
export class UserEntity extends AbstractEntity<UserEntity>{
    @Column({name: 'name', type: 'text'})
    name: string;

    @Column({name: 'email', type: 'text', unique: true})
    email: string;

    @Column({name: 'password', type: 'text', select: false})
    password: string;

    @Column({ name: 'is_verified', default: true })
    isVerified: boolean;

    @Column({ name: 'phone_number', nullable: true })
    phoneNumber: string;

    @Exclude()
    @IsOptional()
    @Column({ name: 'otp', nullable: true })
    otp: number;

    @Column({name: 'roles', type: 'enum', enum:Roles,array:true, default: [Roles.USER]})
    roles: Roles[];
}
