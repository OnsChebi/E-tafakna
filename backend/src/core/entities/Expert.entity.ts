import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Folder } from './Folder.entity';
import { Meeting } from './Meeting.entity';

@Entity('Experts')
export class Expert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ name: 'accessToken', type: 'text' })
  accessToken!: string;

  @OneToMany(() => Folder, (folder) => folder.expert)
  folders!: Folder[];

  @OneToMany(() => Meeting, (meeting) => meeting.expert)
  meetings!: Meeting[];

}