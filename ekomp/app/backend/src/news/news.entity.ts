import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text', nullable: true })
  content?: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string | null;

  /** Basın haberi ise: kategori rozeti, kaynak adı ve haberin özgün bağlantısı. */
  @Column({ type: 'varchar', nullable: true })
  category?: string | null;

  @Column({ type: 'varchar', nullable: true })
  sourceName?: string | null;

  @Column({ type: 'varchar', nullable: true })
  sourceUrl?: string | null;

  /** Tarih yerine gösterilecek metin (örn. "Arşiv haberi"); publishedAt yalnızca sıralama içindir. */
  @Column({ type: 'varchar', nullable: true })
  dateLabel?: string | null;

  /** Haberin görünen tarihi (YYYY-MM-DD). */
  @Column({ type: 'date' })
  publishedAt!: string;

  @Column({ default: true })
  published!: boolean;

  /** İngilizce metinler (isteğe bağlı); boşsa İngilizce sayfada Türkçe gösterilir. */
  @Column({ type: 'varchar', nullable: true })
  titleEn?: string | null;

  @Column({ type: 'text', nullable: true })
  summaryEn?: string | null;

  @Column({ type: 'text', nullable: true })
  contentEn?: string | null;

  @Column({ type: 'varchar', nullable: true })
  categoryEn?: string | null;

  @Column({ type: 'varchar', nullable: true })
  sourceNameEn?: string | null;

  @Column({ type: 'varchar', nullable: true })
  dateLabelEn?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
