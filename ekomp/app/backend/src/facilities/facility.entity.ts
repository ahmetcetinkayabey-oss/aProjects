import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { isProductionDatabase } from '../common/database-driver.js';

@Entity('facilities')
export class Facility {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  category!: string;

  @Column()
  icon!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  badge!: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  @Column()
  footerLeft!: string;

  @Column()
  footerRight!: string;

  @Column({
    type: isProductionDatabase ? 'jsonb' : 'simple-json',
    nullable: true,
  })
  stats?: { label: string; value: string }[] | null;

  /** İngilizce metinler (isteğe bağlı). */
  @Column({ type: 'varchar', nullable: true })
  categoryEn?: string | null;

  @Column({ type: 'varchar', nullable: true })
  titleEn?: string | null;

  @Column({ type: 'text', nullable: true })
  descriptionEn?: string | null;

  @Column({ type: 'varchar', nullable: true })
  badgeEn?: string | null;

  @Column({ type: 'varchar', nullable: true })
  footerLeftEn?: string | null;

  @Column({ type: 'varchar', nullable: true })
  footerRightEn?: string | null;

  @Column({
    type: isProductionDatabase ? 'jsonb' : 'simple-json',
    nullable: true,
  })
  statsEn?: { label: string; value: string }[] | null;

  @Column({ default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
