import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Meeting } from "./Meeting.entity";
import { MeetingsNotification } from "./MeetingsNotifications.entity";
import { Folder } from "./Folder.entity";
@Entity("Experts")
export class Expert {
    @PrimaryGeneratedColumn()
    id!:number
    @Column()
    name!: string
    @Column({unique:true})
    email!:string
    @Column()
    password!: string;
    @OneToMany(() => MeetingsNotification, (MeetingsNotification) => MeetingsNotification.expert)
    meetingsNotifications!: MeetingsNotification[];
    @OneToOne(()=>Meeting, (meeting)=>meeting.expert)
    meetings!:Meeting[];
    @OneToMany(()=>Folder,(folder)=>folder.expert)
    folders!:Folder[];
}