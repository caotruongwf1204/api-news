import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Section } from './Section';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.PAGES)
export class Page extends EntityBase {
  @Column()
  name: string;

  @OneToMany(() => Section, section => section.page, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  sections: Section[];
}
