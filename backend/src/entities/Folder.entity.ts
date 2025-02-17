import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Expert } from "./Expert.entity";
import { Note } from "./Notes.entity";

@Entity("Folders")
export class Folder {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column("name")
    name!: string;
    // if the folder name is the same as the client name
    // @Column({nullable:true})
    // clientName?:string;

    @ManyToOne(()=>Expert,(expert)=>expert.folders)
    expert!: Expert;
    @OneToMany(()=>Note,(note)=>note.folder)
    notes!:Note[];
    }