import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Folder } from './Folder.entity';
import { Meeting } from './Meeting.entity';
import { Task } from './Task.entity';

export type UserRole = 'expert' | 'admin';

@Entity('experts')
export class Expert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ name: 'accessToken', type: 'text',nullable: true })
  accessToken!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImage!: string;

  @Column({ type: 'text', nullable: true })
  bio!: string;

  @Column({ type: 'varchar', default: 'expert' })
  role!: UserRole;

  @OneToMany(() => Folder, (folder) => folder.expert)
  folders!: Folder[];

  @OneToMany(() => Meeting, (meeting) => meeting.expert)
  meetings!: Meeting[];

  @OneToMany(() => Task, (task) => task.expert)
  tasks!: Task[];

}