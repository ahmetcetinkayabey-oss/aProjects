import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../common/decimal.transformer.js';

@Entity('benchmark_centers')
export class BenchmarkCenter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  countryCode!: string;

  @Column()
  location!: string;

  @Column()
  altitudeLabel!: string;

  @Column()
  swimming!: string;

  @Column()
  football!: string;

  @Column()
  athletics!: string;

  @Column()
  combatSports!: string;

  @Column()
  iceAndCurling!: string;

  @Column()
  indoorSports!: string;

  @Column()
  sportsScienceLab!: string;

  @Column('decimal', { precision: 3, scale: 1, transformer: decimalTransformer })
  facilityScore!: number;

  @Column({ default: false })
  isHighlighted!: boolean;

  @Column({ default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
