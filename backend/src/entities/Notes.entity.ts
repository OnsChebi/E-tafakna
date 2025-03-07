import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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
    @ManyToMany(()=>Folder,(folder)=>folder.notes)
    folder!: Folder[];

    }


