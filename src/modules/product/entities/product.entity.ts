import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product', schema: 'ecommerce' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'name', type:'text', length: 100, })
  name: string;

  @Column({name:'description', type:'text'})
  description: string;

  @Column({name:'price', type:'decimal', precision: 10, scale: 2})
  price: number;

  @Column({name:'stock_quantity', type:'int', default: 0})
  stockQuantity: number;

  @Column({name:'category', type:'text', length: 50 })
  category: string;

    @Column({name:'images', type:'jsonb',})
    images: string[];
}
