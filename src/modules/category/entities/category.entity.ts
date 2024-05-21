import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(TableNames.CATEGORIES)
export class Category extends AbstractEntity<Category> {
  @Column({ name: 'name', type: 'text', unique: true })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
