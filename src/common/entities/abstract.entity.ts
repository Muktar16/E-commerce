import { ApiProperty } from '@nestjs/swagger';
import { Expose, instanceToPlain } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export abstract class AbstractEntity<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    type: 'number',
    description: 'The id of the entity',
  })
  @Expose()
  public id: number;

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
  public updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    name: 'deleted_at',
    nullable: true,
  })
  public deletedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
