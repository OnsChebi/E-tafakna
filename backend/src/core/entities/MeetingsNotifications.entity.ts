// import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Expert } from "./Expert.entity";

// @Entity("MeetingsNotification")
// export class MeetingsNotification{
//     @PrimaryGeneratedColumn()
//     id!: number
//     @Column()
//     content!:string
//     @Column()
//     title!:string
//     @Column({default:false})
//     isRead!:boolean
//     @CreateDateColumn()
//     createdAt!:Date;

//     @ManyToOne(() => Expert, (expert) => expert.meetingsNotifications)
//     expert!: Expert;
// }