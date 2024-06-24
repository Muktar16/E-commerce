import { ApiProperty } from '@nestjs/swagger';
import { Expose, instanceToPlain } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { Category } from 'src/modules/category/entities/category.entity';
import { DiscountEntity } from 'src/modules/discount/entities/discount.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity(TableNames.PRODUCTS)
export class ProductEntity extends AbstractEntity<ProductEntity> {
  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Product name',
    example: 'Iphone 12 Pro Max',
  })
  @Column({ name: 'name', type: 'text' })
  name: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Product SKU',
    example: 'IP12PM',
  })
  @Column({ name: 'sku', type: 'text', unique: true })
  sku: string;

  @Expose()
  @ApiProperty({
    type: 'string',
    description: 'Product description',
    example: 'The best iPhone ever',
  })
  @Column({ name: 'description', type: 'text' })
  description: string;

  @Expose()
  @ApiProperty({ type: 'number', description: 'Product price', example: 1200 })
  @Column({ name: 'price', type: 'decimal', precision: 10 })
  price: number;

  @Expose()
  @ApiProperty({
    type: 'number',
    description: 'Product stock quantity',
    example: 100,
  })
  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number;

  @Expose()
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'Product images',
    example: ['image1.jpg', 'image2.jpg'],
  })
  @Column({ name: 'images', type: 'jsonb' })
  images: string[];

  @Expose()
  @ApiProperty({
    type: 'object',
    description: 'Product category',
    example: { id: 1, name: 'Electronics', description: 'Electronics' },
  })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category' })
  category: Category;

  @Expose()
  @ApiProperty({
    type: 'object',
    description: 'Product discount',
    example: {
      id: 1,
      name: 'Summer Sale',
      type: 'percentage',
      value: 20,
      validFrom: '2023-01-01',
      validTo: '2023-12-31',
    },
  })
  @ManyToOne(() => DiscountEntity, (discount) => discount.products)
  @JoinColumn()
  discount: DiscountEntity;

  toJSON() {
    return instanceToPlain(this);
  }
}
