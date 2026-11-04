import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
  status!: ReservationStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
