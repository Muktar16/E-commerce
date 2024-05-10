import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Entity,
  } from 'typeorm';
  import { instanceToPlain } from 'class-transformer';
  @Entity()
  export abstract class AbstractEntity<T> {
    constructor(partial: Partial<T>) {
      Object.assign(this, partial);
    }
  
    @PrimaryGeneratedColumn()
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
  