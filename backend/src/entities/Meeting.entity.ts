import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expert } from "./Expert.entity";



@Entity("Meetings")
export class Meeting{
    @PrimaryGeneratedColumn()
    id!: number
    @Column()
    date!:Date
    @Column()
    time!:string
    @CreateDateColumn()
    created_at!:Date

    @ManyToOne(()=>Expert,(expert)=>expert.meetings)
    expert!:Expert

    
}