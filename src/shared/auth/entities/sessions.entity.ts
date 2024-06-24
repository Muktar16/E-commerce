import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { TableNames } from 'src/common/enums/table-names.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(TableNames.SESSIONS)
export class SessionEntity extends AbstractEntity<SessionEntity> {
  @Column({ name: 'token' })
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;
}
