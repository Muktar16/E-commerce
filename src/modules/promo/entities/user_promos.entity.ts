import { Expose } from "class-transformer";
import { AbstractEntity } from "src/common/entities/abstract.entity";
import { TableNames } from "src/common/enums/table-names.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PromoEntity } from "./promo.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity(TableNames.USER_PROMOS)
export class UserPromoEntity extends AbstractEntity<UserPromoEntity>{
    @Expose()
    @ApiProperty({ example: 1 })
    @Column({ name: 'usage_count', type: 'int', nullable: false, default: 0 })
    usageCount: number;

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn()
    public user: UserEntity   

    @Expose()
    @ManyToOne(() => PromoEntity, (promo) => promo.id)
    @JoinColumn()
    public promo: PromoEntity
}
