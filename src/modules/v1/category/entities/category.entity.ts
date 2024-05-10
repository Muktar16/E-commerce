import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Product } from 'src/modules/v1/product/entities/product.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';

@Entity({ name: 'category', schema: 'ecommerce' })
@Index(['name'], { unique: true })
export class Category extends AbstractEntity<Category> {

    @Column({ name: 'name', type: 'text',})
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @OneToMany(() => Product, product => product.category) // One-to-Many relationship with Product
    products: Product[]; // Define the property for the relationship
}
