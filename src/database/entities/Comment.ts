import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { User } from "./User"
import { BlogPost } from "./BlogPost"
import { EntityBase } from "./EntitiesBase"
import { DBTable } from "../../constants/DBTable"
import { Notification } from "./Notification"

@Entity(DBTable.COMMENT)
export class Comment extends EntityBase{
  [x: string]: any
  @Column()
  content: string

  @Column({ default: 0 })
  likeCount: number // Số lượt like, mặc định là 0
  
  @Column({ default: 0 })
  shareCount: number // Số lượt share, mặc định là 0
  
  @Column({ default: 0 })
  replyCount: number // Số lượt reply, mặc định là 0
  
  @Column({ default: 0 })
  dislikeCount: number // Số lượt dislike, mặc định là 0
  
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdDate: Date // Thời điểm tạo của tệp tin
  
  @Column({default: null})
  imgUrl:string

  @Column({ nullable: true, default: null })
  parentComment: number;

  @ManyToOne(() => BlogPost, (post) => post.comments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  blogPost: BlogPost
  
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User

  @OneToMany(() => Notification, (notification) => notification.comments, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  notifications: Notification
  
  @ManyToOne(() => Comment, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'parentComment' })
  parent: Comment;
}
