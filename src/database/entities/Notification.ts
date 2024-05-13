import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Comment } from "./Comment"
import { EntityBase } from "./EntitiesBase"
import { DBTable } from "../../constants/DBTable"
import { User } from "./User"
@Entity(DBTable.NOTIFICATION)
export class Notification extends EntityBase {
  @Column()
  notification: string

  @Column({ nullable: true, default: null })
  commentsId: number

  @Column({ nullable: true, default: null })
  userId: number

  // @OneToMany(() => Comment, comment => comment.notification)
  // comments: Comment[];
  @ManyToOne(() => Comment, (comment) => comment.notifications,{ onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  comments: Comment;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdDate: Date // Thời điểm tạo của tệp tin
}
