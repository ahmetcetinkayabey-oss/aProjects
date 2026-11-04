import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { isProductionDatabase } from '../common/database-driver.js';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  organizationName!: string;

  @Column()
  contactName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  sportBranch!: string;

  @Column({ type: 'int', nullable: true })
  groupSize?: number;

  @Column({ type: 'date', nullable: true })
  preferredStartDate?: string;

  @Column({ type: 'date', nullable: true })
  preferredEndDate?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({
    type: isProductionDatabase ? 'enum' : 'simple-enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status!: ReservationStatus;

  @Column({ type: 'text', nullable: true })
  adminNote?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
