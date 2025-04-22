import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expert } from "./Expert.entity";

@Entity("Meetings")
export class Meeting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  eventId!: string; 

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @Column()
  inviteeName!: string;

  @Column()
  inviteeEmail!: string;

  @Column({ nullable: true })
  inviteeImage?: string;

  @Column()
  type!: 'Online' | 'In person';

  @Column({ nullable: true })
  meetingUrl!: string;

  @ManyToOne(() => Expert, (expert) => expert.meetings)
  expert!: Expert;

  @CreateDateColumn()
  created_at!: Date;
}