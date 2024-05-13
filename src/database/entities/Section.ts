import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Page } from './Page';
import { Content } from './Content';
import { EntityBase } from './EntitiesBase';
import { DBTable } from '../../constants/DBTable';

@Entity(DBTable.SECTION)
export class Section extends EntityBase{
  @Column()
  name: string;

  @Column()
  pageId: number

  @Column()
  contentId: number

  @ManyToOne(type => Page, page => page.sections, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({name: 'pageId'})
  page: Page;

  @ManyToOne(type => Content, content => content.sections, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({name: 'contentId'})
  content: Content;
}