import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { Category } from 'src/modules/category/entities/category.entity';
import { Entity, Column, ManyToOne, JoinColumn, } from 'typeorm';

@Entity(TableNames.PRODUCTS)
export class ProductEntity extends AbstractEntity<ProductEntity> {

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'sku', type: 'text', unique: true})
  sku: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ name: 'images', type: 'jsonb' })
  images: string[];

  @ManyToOne(() => Category, category => category.products) 
  @JoinColumn({ name: 'category' }) 
  category: Category; 

}
