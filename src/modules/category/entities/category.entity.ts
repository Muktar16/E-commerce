import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(TableNames.CATEGORIES)
export class Category extends AbstractEntity<Category> {
  @Expose()
  @ApiProperty({ type: String , description: 'Category name', example: 'Electronics'})
  @Column({ name: 'name', type: 'text', unique: true })
  name: string;

  @Expose()
  @Column({ name: 'description', type: 'text' })
  @ApiProperty({ type: String , description: 'Category description', example: 'Electronics'})
  description: string;

  @Expose()
  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
