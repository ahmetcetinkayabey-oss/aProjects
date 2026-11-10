import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { isProductionDatabase } from '../common/database-driver.js';

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  /** Parola değiştirilince güncellenir; bu andan önce verilmiş oturum belirteçleri geçersiz sayılır. */
  @Column({ type: isProductionDatabase ? 'timestamp' : 'datetime', nullable: true })
  passwordChangedAt?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
