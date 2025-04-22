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
    @Column({ type: 'varchar', length: 1000, nullable: true })
    calendly_access_token!: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    calendly_refresh_token!: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    calendly_user_uri!: string;

    @Column({ type: 'varchar',length: 1000, nullable: true })
        calendly_link!: string;
  calendly_token: any;

   
}