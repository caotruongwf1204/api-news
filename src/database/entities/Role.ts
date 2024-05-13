import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from './User';
import { Permission } from './Permission';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.ROLE)
export class Role  extends EntityBase{
  @Column()
  name: string;

  @ManyToMany(() => User, user => user.roles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({ name: 'user_role'})
  users: User[];

  @ManyToMany(() => Permission, permission => permission.roles, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({ name: 'role_permission'})
  permissions: Permission[];
  
}
