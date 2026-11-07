import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

/** Yönetim panelinden değiştirilen site metni. Kayıt yoksa sitede koddaki varsayılan metin gösterilir. */
@Entity('site_content')
export class SiteContent {
  @PrimaryColumn({ type: 'varchar', length: 120 })
  key!: string;

  @Column({ type: 'text' })
  tr!: string;

  @Column({ type: 'text', nullable: true })
  en?: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}
