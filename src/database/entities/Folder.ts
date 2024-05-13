import { Entity, OneToMany, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User'; // Import model User để thiết lập mối quan hệ
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';
import { File } from './File';

@Entity(DBTable.FOLDER)
export class Folder extends EntityBase {
  [x: string]: any;
  
  @Column()
  name: string
  
  @Column()
  userId: number

  @Column({ nullable: true, default: null })
  parentFolder: number;

  @ManyToOne(() => User, (user) => user.folders)
  user: User; // Mối quan hệ nhiều-nhiều với bảng User
  
  @OneToMany(() => File, file => file.folder, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  files: File[]

  @ManyToOne(() => Folder, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'parentFolder' })
  parent: Folder;
}
