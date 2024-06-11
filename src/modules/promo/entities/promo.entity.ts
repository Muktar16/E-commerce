import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { UserPromoEntity } from './user_promos.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity(TableNames.PROMOS)
export class PromoEntity extends AbstractEntity<PromoEntity> {
  @Expose()
  @ApiProperty({ example: 'PROMO110' })
  @Column({ name: 'code', type: 'text', unique: true })
  code: string;

  @Expose()
  @ApiProperty({ example: 10 })
  @Column({
    name: 'discount_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  discountPercentage: number;

  @Expose()
  @ApiProperty({ example: '2024-06-11' })
  @Column({ name: 'start_date', type: 'timestamp without time zone' })
  startDate: Date;

  @Expose()
  @ApiProperty({ example: '2024-06-15' })
  @Column({ name: 'end_date', type: 'timestamp without time zone' })
  endDate: Date;

  @Expose()
  @ApiProperty({ example: 1 })
  @Column({ name: 'usage_limit', type: 'integer', default: null })
  usageLimit: number;

  @Expose()
  @ApiProperty({
    type: 'array',
    example: [
      {
        id: 1,
        usageCount: 0,
        user: {
          id: 111,
          name: 'John Doe',
          email: 'muktarmridha6@gmail.com',
          isVerified: true,
          phoneNumber: '+8801712345280',
          role: 'user',
        },
      },
    ],
  })
  @OneToMany(() => UserPromoEntity, (userPromo) => userPromo.promo)
  @JoinColumn()
  public userPromos: UserPromoEntity[];
}
