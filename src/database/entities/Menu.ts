import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User'; // Import model User để thiết lập mối quan hệ
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';
import { Permission } from './Permission';

@Entity(DBTable.MENU)
export class Menu extends EntityBase {
  @Column()
  name: string; // Tên item đã tải lên

  @Column()
  url: string; // Đường dẫn tới tệp tin


  @ManyToMany(() => Permission, permission => permission.menu, { onDelete: 'CASCADE', onUpdate: 'CASCADE' } )
  @JoinTable({ name: 'menu_permission'})
  permissions: Permission[]; // Mối quan hệ nhiều-nhiều với bảng Permission
}
