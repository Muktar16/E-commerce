import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { CartItemEntity } from './cart-items.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity(TableNames.CARTS)
export class CartEntity extends AbstractEntity<CartEntity> {
  @Expose()
  @ApiProperty({ type: 'number', description: 'User ID', example: 1 })
  @Column({ name: 'user_id' })
  userId: number;

  @Expose()
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Expose()
  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  @JoinColumn()
  public cartItems: CartItemEntity[];
}
