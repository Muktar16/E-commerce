import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { TableNames } from 'src/common/enums/table-names.enum';

@Entity(TableNames.PROMOS)
export class PromoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code', type: 'text', unique: true })
  code: string;

  @Column({ name: 'discount_percentage', type: 'decimal', precision: 5, scale: 2 })
  discountPercentage: number;

  @Column({ name: 'start_date', type: 'timestamp without time zone' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp without time zone' })
  endDate: Date;

  @ManyToMany(() => ProductEntity)
  @JoinTable({
    name: 'promo_products',
    joinColumn: {
      name: 'promo_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  applicableProducts: ProductEntity[];
}

