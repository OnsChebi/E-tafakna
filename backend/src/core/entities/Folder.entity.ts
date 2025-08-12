import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  JoinTable,
} from "typeorm";
import { Expert } from "./Expert.entity";
import { Note } from "./Notes.entity";
import { Document } from "./Document.entity";
import { Tag } from "./Tag.entity";

@Entity("folders")
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

  @OneToMany(() => Document, (document) => document.folder)
  documents!: Document[];

  @ManyToMany(() => Tag, (tag) => tag.folders, { cascade: true })
  @JoinTable({
    name: "folders_tags_tags", 
    joinColumn: { name: "folderId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tagId", referencedColumnName: "id" },
  })
  tags!: Tag[];
}
