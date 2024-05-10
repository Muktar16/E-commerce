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

    @Column({name: 'roles', type: 'enum', enum:Roles,array:true, default: [Roles.USER]})
    roles: Roles[];
}
