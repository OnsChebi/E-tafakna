import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Folder } from './Folder.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 20 })
  color!: string;

  @OneToMany(() => Folder, (folder) => folder.tag)
  folders!: Folder[];
}
