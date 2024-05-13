import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Section } from './Section';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.CONTENT)
export class Content extends EntityBase {
  @Column({ type: 'text' })
  data: any;
  @OneToMany(() => Section, section => section.content,{ onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  sections: Section[];
}