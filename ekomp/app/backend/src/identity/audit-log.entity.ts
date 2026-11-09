import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { isProductionDatabase } from '../common/database-driver.js';

const DATETIME = isProductionDatabase ? 'timestamptz' : 'datetime';
const JSON_TYPE = isProductionDatabase ? 'jsonb' : 'simple-json';

/** Yalnızca eklenir. Üretimde tablo trigger ile değiştirilemez/silinemez (001-foundation). */
@Entity('audit_logs', { synchronize: !isProductionDatabase })
export class AuditLog {
  /** PostgreSQL'de bigserial (string döner), SQLite'ta tamsayı. */
  @PrimaryGeneratedColumn('increment')
  id!: number | string;

  @Column({ name: 'user_id', type: 'varchar', nullable: true })
  userId?: string | null;

  @Column({ name: 'actor_label', type: 'varchar', nullable: true })
  actorLabel?: string | null;

  @Column({ type: 'varchar' })
  action!: string;

  @Column({ type: 'varchar' })
  entity!: string;

  @Column({ name: 'entity_id', type: 'varchar', nullable: true })
  entityId?: string | null;

  @Column({ type: JSON_TYPE, nullable: true })
  before?: unknown;

  @Column({ type: JSON_TYPE, nullable: true })
  after?: unknown;

  @Column({ type: 'varchar', nullable: true })
  ip?: string | null;

  @CreateDateColumn({ name: 'at', type: DATETIME })
  at!: Date;
}
