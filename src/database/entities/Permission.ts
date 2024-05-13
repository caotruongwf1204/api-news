import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Role } from './Role';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';
import { Menu } from './Menu';

@Entity(DBTable.PERMISSIONS)
export class Permission extends EntityBase{
  @Column()
  name: string;

  @ManyToMany(() => Role, role => role.permissions, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({ name: 'role_permission'})
  roles: Role[];

  @ManyToMany(() => Menu, menu => menu.permissions, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({ name: 'menu_permission'})
  menu: Menu[];
}
