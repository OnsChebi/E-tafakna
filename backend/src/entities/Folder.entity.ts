import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Expert } from "./Expert.entity";
import { Note } from "./Notes.entity";

@Entity("Folders")
@Unique("UQ_FOLDER_EXPERT_NAME", ["name", "expert"])
export class Folder {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar", { length: 255 }) 
    name!: string;

    @ManyToOne(() => Expert, (expert) => expert.folders)
    expert!: Expert;

    @OneToMany(() => Note, (note) => note.folder)
    notes!: Note[];
}