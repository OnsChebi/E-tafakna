import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Notification } from "./Notifications.entity";
import { Meeting } from "./Meeting.entity";
@Entity("Experts")
export class Expert {
    @PrimaryGeneratedColumn()
    id!:Number
    @Column()
    name!: string
    @Column({unique:true})
    email!:string
    @OneToMany(() => Notification, (notification) => notification.expert)
    notifications!: Notification[];
    @OneToOne(()=>Meeting, (meeting)=>meeting.expert)
    meetings!:Meeting[];
}