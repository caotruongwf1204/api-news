import { DBTable } from '../../constants/DBTable';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityBase } from './EntitiesBase';


@Entity(DBTable.EMAIL)
export class Email extends EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    userId: number;

    constructor(code: string, userId: number) {
        super(); // Gọi constructor của EntityBase nếu có
        this.code = code;
        this.userId = userId;
    }
}
