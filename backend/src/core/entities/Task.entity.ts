import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Expert } from "./Expert.entity";
  
  @Entity()
  export class Task {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    title!: string;
  
    @Column({ nullable: true })
    description!: string;
  
    @Column({ default: "pending" })
    status!: "pending" | "in-progress" | "completed" ;
  
    @Column({ nullable: true })
    dueDate!: Date;
  
    @ManyToOne(() => Expert, (expert) => expert.tasks)
    expert!: Expert;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  