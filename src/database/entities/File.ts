import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User'; // Import model User để thiết lập mối quan hệ
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';
import { Folder } from './Folder';

@Entity(DBTable.FILE)
export class File extends EntityBase {
  @Column()
  filename: string; // Tên tệp tin đã tải lên

  @Column({ nullable: true, default: null })
  filepath: string; // Đường dẫn tới tệp tin

  @Column({ nullable: true, default: null })
  filetype: string; // Loại tệp tin (ví dụ: 'image', 'video', 'audio', 'document', ...)

  @Column({ nullable: true, default: null })
  folderId: number;

  @Column({ nullable: true, default: null })
  userId: number;

  @ManyToOne(() => User, user => user.files)
  user: User; // Mối quan hệ nhiều-nhiều với bảng User

  @ManyToOne(() => Folder, folder => folder.files, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  folder: Folder
}
