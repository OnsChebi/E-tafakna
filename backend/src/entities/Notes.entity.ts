import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Folder } from "./Folder.entity";

@Entity("Notes")
export class Note {
    @PrimaryGeneratedColumn()
    id!: number;
    // @Column("title")
    // title!: string;
    @Column()
    text!: string;
    @CreateDateColumn()
    created_at!: Date;
    @ManyToOne(()=>Folder,(folder)=>folder.notes)
    folder!:Folder;

    }


