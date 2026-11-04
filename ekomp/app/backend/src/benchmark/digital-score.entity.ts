import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../common/decimal.transformer.js';

@Entity('digital_scores')
export class DigitalScore {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  centerName!: string;

  @Column()
  countryCode!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column('decimal', { precision: 3, scale: 2, transformer: decimalTransformer })
  totalScore!: number;

  @Column('decimal', { precision: 3, scale: 1, transformer: decimalTransformer })
  uxScore!: number;

  @Column('decimal', { precision: 3, scale: 1, transformer: decimalTransformer })
  reservationScore!: number;

  @Column()
  thirdMetricLabel!: string;

  @Column('decimal', { precision: 3, scale: 1, transformer: decimalTransformer })
  thirdMetricScore!: number;

  @Column({ default: false })
  isVision!: boolean;

  @Column({ default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
