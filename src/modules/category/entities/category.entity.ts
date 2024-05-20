import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';

@Entity({ name: 'category', schema: 'ecommerce' })
@Index(['name'], { unique: true })
export class Category extends AbstractEntity<Category> {

    @Column({ name: 'name', type: 'text', unique: true})
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @OneToMany(() => ProductEntity, product => product.category) // One-to-Many relationship with Product
    products: ProductEntity[]; // Define the property for the relationship
}
