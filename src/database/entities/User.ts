import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Role } from './Role';
import { BlogPost } from './BlogPost';
import { Comment } from './Comment';
import { SocialAccount } from './SocialAccount';
import { File } from './File';
import { DBTable } from '../../constants/DBTable';
import { EntityBase } from './EntitiesBase';
import { Folder } from './Folder';
import { Notification } from './Notification';
@Entity(DBTable.USERS)
export class User extends EntityBase {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  imgUrl: string

  @Column({default: null})
  refreshToken: string;

  @ManyToMany(() => Role, role => role.users, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({ name: 'user_role'})
  roles: Role[];

  @OneToMany(() => BlogPost, blogPost => blogPost.user)
  blogPosts: BlogPost[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => SocialAccount, socialAccount => socialAccount.user)
  socialAccounts: SocialAccount[];

  @OneToMany(() => File, file => file.user)
  files: File[]

  @OneToMany(() => Folder, folder => folder.user)
  folders: Folder[]

  @OneToMany(() => Notification, notifications => notifications.user)
  notifications: Notification[]
}
