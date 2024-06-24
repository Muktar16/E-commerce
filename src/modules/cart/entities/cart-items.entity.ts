import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity(TableNames.CART_ITEMS)
export class CartItemEntity extends AbstractEntity<CartItemEntity> {
  @Expose()
  @ApiProperty({ type: 'number', description: 'Product ID', example: 1 })
  @Column({ name: 'quantity', type: 'int', nullable: false })
  quantity: number;

  @Expose()
  @ApiProperty({ type: 'number', description: 'Product ID', example: 1 })
  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn()
  public product: ProductEntity;

  @Expose()
  @ManyToOne(() => CartEntity, (cart) => cart.id)
  @JoinColumn()
  public cart: CartEntity;
}
