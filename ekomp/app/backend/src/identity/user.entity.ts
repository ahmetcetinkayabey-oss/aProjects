import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { isProductionDatabase } from '../common/database-driver.js';
import { Role } from './role.entity.js';

const DATETIME = isProductionDatabase ? 'timestamptz' : 'datetime';

export type UserType = 'PERSONNEL' | 'B2C' | 'B2B';
export type UserStatus = 'ACTIVE' | 'DISABLED' | 'INVITED';

@Entity('users', { synchronize: !isProductionDatabase })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Her zaman küçük harfle saklanır (üretimde ayrıca lower(email) benzersiz indeksi vardır). */
  @Column({ type: 'varchar' })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: true, select: false })
  passwordHash?: string | null;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName!: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string | null;

  @Column({ name: 'user_type', type: 'varchar' })
  userType!: UserType;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status!: UserStatus;

  /** Parola değişince / hesap kapanınca artar; eski oturum belirteçleri geçersiz olur. */
  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion!: number;

  @Column({ name: 'last_login_at', type: DATETIME, nullable: true })
  lastLoginAt?: Date | null;

  @CreateDateColumn({ name: 'created_at', type: DATETIME })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: DATETIME })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: DATETIME })
  deletedAt?: Date | null;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: Role[];
}
