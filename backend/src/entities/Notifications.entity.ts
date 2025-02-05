import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expert } from "./Expert.entity";

@Entity()
export class Notification{
    @PrimaryGeneratedColumn()
    id!: number
    @Column()
    content!:string
    @Column()
    title!:string
    @Column({default:false})
    isRead!:boolean
    @CreateDateColumn()
    createdAt!:Date;

    @ManyToOne(() => Expert, (expert) => expert.notifications)
    expert!: Expert;
}