import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
  } from "typeorm";
  import { Meeting } from "./Meeting.entity";
  import { Folder } from "./Folder.entity";
  
  @Entity("Documents")
  export class Document {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column("varchar", { length: 255 })
    title!: string;
  
    @Column("varchar", { length: 500 })
    url!: string;
  
    @Column("varchar", { length: 20 })
    type!: 'pdf' | 'docx' | 'image' | 'other';
  
    @CreateDateColumn()
    uploadedAt!: Date;
  
    @ManyToOne(() => Meeting, (meeting) => meeting.documents, { nullable: true })
    meeting?: Meeting;
  
    @ManyToOne(() => Folder, (folder) => folder.documents, { nullable: true })
    folder?: Folder;
  }
  