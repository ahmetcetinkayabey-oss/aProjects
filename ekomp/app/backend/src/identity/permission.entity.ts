import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { isProductionDatabase } from '../common/database-driver.js';

/** Üretimde tablolar migration ile gelir (001-foundation); geliştirmede (SQLite) otomatik oluşur. */
@Entity('permissions', { synchronize: !isProductionDatabase })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  code!: string;

  @Column({ type: 'varchar', default: '' })
  description!: string;
}
