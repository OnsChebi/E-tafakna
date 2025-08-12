import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Folder } from "./Folder.entity";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 20 })
  color!: string;

  @ManyToMany(() => Folder, (folder) => folder.tags)
  folders!: Folder[];
}
