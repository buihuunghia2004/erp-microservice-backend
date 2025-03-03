import { UserEntity } from '@/api/user/entities/user.entity';
import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {UserRole} from '@shared/constants/role.constant'
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('role')
export class RoleEntity extends AbstractEntity {
  constructor(data?: Partial<RoleEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_role_id',
  })
  id!: Uuid;

  @Column({enum: UserRole})
  name!: UserRole;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  user?: UserEntity
}
