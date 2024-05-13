import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { DBTable } from '@/constants/DBTable';

@Entity()
export class EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true,default: null })
  updatedAt: Date;

  @Column({ nullable: true, default: null })
  deletedAt: Date;
 
}
