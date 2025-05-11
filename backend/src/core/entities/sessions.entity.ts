// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { Expert } from './Expert.entity';

// @Entity('Sessions')
// export class Session {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string;

//   @Column({ type: 'text', nullable: false })
//   hashedRefreshToken!: string;

//   @Column({ type: 'varchar', length: 255 })
//   userAgent!: string;

//   @Column({ type: 'inet' })
//   ipAddress!: string;

//   @Column({ type: 'timestamp' })
//   expiresAt!: Date;

//   @Column({ type: 'boolean', default: false })
//   revoked!: boolean;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt!: Date;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
//   updatedAt!: Date;

  
//   @ManyToOne(() => Expert, expert => expert.sessions)
//   @JoinColumn({ name: 'expertId' })
//   expert!: Expert;

//   @Column()
//   expertId!: number;
// }