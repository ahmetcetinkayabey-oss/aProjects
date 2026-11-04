import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  imageUrl?: string;

  @Column()
  footerLeft!: string;

  @Column()
  footerRight!: string;

  @Column({ type: 'jsonb', nullable: true })
  stats?: { label: string; value: string }[] | null;

  @Column({ default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
