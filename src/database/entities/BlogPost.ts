import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Comment } from './Comment';
import { Tag } from './Tag';
import { Category } from './Category';
import { User } from './User';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';
import { File } from './File';
@Entity(DBTable.BLOGPOST)
export class BlogPost extends EntityBase {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true, default: null })
  viewCount: string;

  @Column()
  categoryId: number;

  @Column()
  userId: number;

  @Column({ nullable: true, default: null })
  imgUrl: string


  @OneToOne(() => File,{ onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  featuredImage: File;
  // Trường 'status' có các giá trị 'draft', 'pending', 'published', 'trash'
  @Column({ default: 'draft' })
  status: string;

  @ManyToOne(() => Category, category => category.blogPosts, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  category: Category;

  @ManyToOne(() => User, user => user.blogPosts, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  user: User;

  @OneToMany(() => Comment, comment => comment.blogPost, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  comments: Comment[];

  @ManyToMany(() => Tag, tag => tag.blogPost, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({ name: 'blogpost_tag' })
  tags: Tag[];
}