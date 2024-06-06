import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity(TableNames.DISCOUNTS)
export class DiscountEntity extends AbstractEntity<DiscountEntity> {

  @Expose()
  @ApiProperty({ type: 'string', description: 'Discount name', example: 'Summer Sale' })
  @Column({ name: 'name', type: 'text' })
  name: string;

  @Expose()
  @ApiProperty({ type: 'string', description: 'Discount type', example: 'percentage', enum: ['flat', 'percentage'] })
  @Column({ name: 'type', type: 'text' })
  type: string;

  @Expose()
  @IsNumber()
  @ApiProperty({ type: 'number', description: 'Discount value', example: 20 })
  @Column({ name: 'value', type: 'decimal', precision: 10, scale: 2, default: 0 })
  value: number;

  @Expose()
  @ApiProperty({ type: 'date', description: 'Discount start date', example: '2023-01-01' })
  @Column({ name: 'valid_from', type: 'date' })
  validFrom: Date;

  @Expose()
  @ApiProperty({ type: 'date', description: 'Discount end date', example: '2023-12-31' })
  @Column({ name: 'valid_to', type: 'date' })
  validTo: Date;

  @OneToMany(() => ProductEntity, product => product.discount)
  products: ProductEntity[];
}

