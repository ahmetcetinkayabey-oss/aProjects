import { Column, Entity, PrimaryColumn } from 'typeorm';

/** Panelden girilen ayarlar (ör. e-posta/SMTP). Anahtar adları .env ile aynıdır; kayıt varsa .env'in önüne geçer. */
@Entity('app_settings')
export class AppSetting {
  @PrimaryColumn({ type: 'varchar', length: 60 })
  key!: string;

  @Column({ type: 'text' })
  value!: string;
}
