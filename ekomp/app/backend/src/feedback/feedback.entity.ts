import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email?: string | null;

  /** Öneri, Şikayet, Teşekkür veya Diğer. */
  @Column({ type: 'varchar', length: 30 })
  category!: string;

  /** 1-5 arası memnuniyet puanı (isteğe bağlı). */
  @Column({ type: 'int', nullable: true })
  rating?: number | null;

  @Column({ type: 'text' })
  message!: string;

  @Column({ default: false })
  handled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
