import { Column, Entity, PrimaryGeneratedColumn,BeforeInsert } from "typeorm";
@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({unique: true})
    username: string;
    @Column()
    password: string;
    @Column({unique: true})
    email: string;
    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}