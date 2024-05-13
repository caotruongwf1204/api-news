import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { BlogPost } from './BlogPost';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.TAG)
export class Tag  extends EntityBase{
  @Column()
  name: string;

  @ManyToMany(() => BlogPost, blogPost => blogPost.tags, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({name: 'blogpost_tag'})
  blogPost: BlogPost[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date; // Thời điểm tạo của tệp tin
}