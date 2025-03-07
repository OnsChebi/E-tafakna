import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Expert } from "./Expert.entity";
import { Note } from "./Notes.entity";

@Entity("Folders")
export class Folder {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar", { length: 255, unique: true }) 
    name!: string;

    // Optional: If you want to store the client name
    // @Column("varchar", { length: 255, nullable: true }) // Use "varchar" for string fields
    // clientName?: string;

    @ManyToOne(() => Expert, (expert) => expert.folders)
    expert!: Expert;

    @OneToMany(() => Note, (note) => note.folder)
    notes!: Note[];
}