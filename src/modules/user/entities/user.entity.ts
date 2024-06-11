import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { Roles } from 'src/common/enums/user-roles.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';
import { OrderEntity } from '../../order/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserPromoEntity } from 'src/modules/promo/entities/user_promos.entity';

@Entity(TableNames.USERS)
export class UserEntity extends AbstractEntity<UserEntity> {
  @Expose()
  @ApiProperty({ example: 'John Doe' })
  @Column({ name: 'name', type: 'text' })
  name: string;

  @Expose()
  @Column({ name: 'email', type: 'text', unique: true })
  email: string;

  @Exclude()
  @Column({ name: 'password', type: 'text', select: false })
  password: string;

  @Expose()
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Expose()
  @Column({ name: 'phone_number', nullable: true, unique: true })
  phoneNumber: string;

  @Expose()
  @Column({ name: 'role', type: 'text', default: Roles.USER })
  role: string;

  @Exclude()
  @IsOptional()
  @Column({ name: 'otp', nullable: true })
  otp: number;

  @Exclude()
  @Column({ name: 'otp_created_at', nullable: true })
  @IsOptional()
  otpCreatedAt: Date;

  @Exclude()
  @Column({ name: 'reset_password_token', type: 'text', nullable: true })
  @IsOptional()
  resetPasswordToken: string;

  @Exclude()
  @Column({ name: 'reset_password_token_expires',type: 'timestamp', nullable: true })
  @IsOptional()
  resetPassTokenExpires: Date;

  @Exclude()
  @Column({name:'refresh_token', nullable: true })
  refreshToken?: string;

  @Exclude()
  @Column({name:'refresh_token_expires', type: 'timestamp', nullable: true })
  refreshTokenExpires?: Date;

  @OneToOne(() => CartEntity, (cart) => cart.user)
  cart: CartEntity;

  @OneToMany(() => OrderEntity, (order) => order.id)
  orders: OrderEntity[];

  @OneToMany(() => UserPromoEntity, (userPromo) => userPromo.user)
  @JoinColumn()
  public userPromos: UserPromoEntity[];
  
  toJSON() {
    return instanceToPlain(this);
  }
}
