import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Category } from 'src/modules/v1/category/entities/category.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'product', schema: 'ecommerce' })
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

  @ManyToOne(() => Category, category => category.products) // Many-to-One relationship with Category
  @JoinColumn({ name: 'category' }) // Define the join column
  category: Category; // Define the property for the relationship
}
