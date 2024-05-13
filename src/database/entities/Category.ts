import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { BlogPost } from './BlogPost';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.CATEGORY)
export class Category extends EntityBase {
  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date; // Thời điểm tạo của tệp tin

  @OneToMany(() => BlogPost, blogPost => blogPost.category, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  blogPosts: BlogPost[];
}
