import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User'; // Import model User để thiết lập mối quan hệ
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.SOCIALACCOUNT)
export class SocialAccount  extends EntityBase{
  @Column()
  platform: string; // Nhà cung cấp dịch vụ xã hội (ví dụ: 'facebook', 'github', 'google')
  provider: string; // Nhà cung cấp dịch vụ xã hội (ví dụ: 'facebook', 'github', 'google')

  @Column()
  providerId: string; // ID của người dùng trên nền tảng xã hội

  @ManyToOne(type => User, user => user.socialAccounts)
  user: User; // Mối quan hệ nhiều-nhiều với bảng User
}
