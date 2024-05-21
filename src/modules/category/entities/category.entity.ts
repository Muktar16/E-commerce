import { SCHEMA_NAME } from 'src/common/constants/schema-name';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';

@Entity(TableNames.CATEGORIES)
@Index(['name'], { unique: true })
export class Category extends AbstractEntity<Category> {

    @Column({ name: 'name', type: 'text', unique: true})
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @OneToMany(() => ProductEntity, product => product.category) // One-to-Many relationship with Product
    products: ProductEntity[]; // Define the property for the relationship
}
