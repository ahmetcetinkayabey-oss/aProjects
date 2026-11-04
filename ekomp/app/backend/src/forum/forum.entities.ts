import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { isProductionDatabase } from '../common/database-driver.js';

const DATETIME = isProductionDatabase ? 'timestamp' : 'datetime';

export const PARTICIPANT_STATUSES = [
  'RECEIVED',
  'REVIEW',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
] as const;

export const PARTICIPANT_CATEGORIES = [
  'TOUR_OPERATOR',
  'SPORTS_FEDERATION',
  'SKI_RESORT',
  'HIGH_ALTITUDE_CENTER',
  'HOTEL',
  'INVESTOR',
  'PUBLIC',
  'ACADEMIC',
  'SPEAKER',
  'PRESS',
  'OTHER',
] as const;

export const SESSION_TYPES = [
  'OPENING',
  'KEYNOTE',
  'PANEL',
  'WORKSHOP',
  'TECHNICAL',
  'B2B',
  'BREAK',
  'CLOSING',
] as const;

export const SESSION_STATUSES = ['DRAFT', 'CONFIRMED', 'PUBLISHED'] as const;
export const CONFIRMATIONS = ['INVITED', 'CONFIRMED'] as const;
export const MEDIA_KINDS = ['GALLERY', 'BANNER', 'HERO'] as const;
export const FORUM_DAYS = ['2027-04-16', '2027-04-17'] as const;

@Entity('forum_participants')
export class ForumParticipant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phone!: string;

  @Column()
  country!: string;

  @Column()
  city!: string;

  @Column()
  organization!: string;

  @Column()
  jobTitle!: string;

  @Column()
  category!: string;

  @Column({ type: 'text', nullable: true })
  bio?: string | null;

  @Column({ type: 'varchar', nullable: true })
  interests?: string | null;

  @Column({ type: 'varchar', nullable: true })
  photoUrl?: string | null;

  @Column({ default: false })
  wantsB2B!: boolean;

  /** PUBLIC: herkese açık dizin · PARTICIPANTS: yalnızca onaylı katılımcılar · HIDDEN: listelenmez */
  @Column({ default: 'PARTICIPANTS' })
  visibility!: string;

  /** E-posta/telefon varsayılan olarak paylaşılmaz. */
  @Column({ default: false })
  shareContact!: boolean;

  @Column({ select: false })
  passwordHash!: string;

  @Column({ type: DATETIME, nullable: true })
  emailVerifiedAt?: Date | null;

  /** RECEIVED, REVIEW, APPROVED, REJECTED, CANCELLED */
  @Column({ default: 'RECEIVED' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  adminNote?: string | null;

  @Column({ type: DATETIME })
  privacyConsentAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

/** E-posta doğrulama ve şifre sıfırlama jetonları. Yalnızca SHA-256 özeti saklanır. */
@Entity('forum_tokens')
export class ForumToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  participantId!: string;

  /** VERIFY | RESET */
  @Column()
  type!: string;

  @Column({ unique: true })
  tokenHash!: string;

  @Column({ type: DATETIME })
  expiresAt!: Date;

  @Column({ type: DATETIME, nullable: true })
  usedAt?: Date | null;
}

@Entity('forum_speakers')
export class ForumSpeaker {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: '' })
  titleTr!: string;

  @Column({ default: '' })
  titleEn!: string;

  @Column({ default: '' })
  organization!: string;

  @Column({ default: '' })
  country!: string;

  @Column({ type: 'varchar', nullable: true })
  photoUrl?: string | null;

  @Column({ type: 'text', default: '' })
  bioTr!: string;

  @Column({ type: 'text', default: '' })
  bioEn!: string;

  @Column({ type: 'simple-json', nullable: true })
  links?: string[] | null;

  /** INVITED = davet edildi, CONFIRMED = teyit edildi. */
  @Column({ default: 'INVITED' })
  confirmation!: string;

  @Column({ default: false })
  published!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}

@Entity('forum_sessions')
export class ForumSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** YYYY-MM-DD (16 veya 17 Nisan 2027). Saatler Europe/Istanbul. */
  @Column()
  day!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @Column({ default: '' })
  room!: string;

  @Column()
  titleTr!: string;

  @Column({ default: '' })
  titleEn!: string;

  @Column({ type: 'text', default: '' })
  descriptionTr!: string;

  @Column({ type: 'text', default: '' })
  descriptionEn!: string;

  @Column({ default: 'PANEL' })
  type!: string;

  @Column({ default: '' })
  moderator!: string;

  /** DRAFT, CONFIRMED, PUBLISHED — yalnızca PUBLISHED herkese açık programda görünür. */
  @Column({ default: 'DRAFT' })
  status!: string;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @ManyToMany(() => ForumSpeaker, { eager: true })
  @JoinTable({ name: 'forum_session_speakers' })
  speakers!: ForumSpeaker[];
}

@Entity('forum_media')
export class ForumMedia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'GALLERY' })
  kind!: string;

  @Column({ type: 'varchar', nullable: true })
  url?: string | null;

  /** YouTube/Vimeo bağlantısı (isteğe bağlı). */
  @Column({ type: 'varchar', nullable: true })
  videoUrl?: string | null;

  @Column({ default: '' })
  titleTr!: string;

  @Column({ default: '' })
  titleEn!: string;

  @Column({ type: 'text', default: '' })
  descriptionTr!: string;

  @Column({ type: 'text', default: '' })
  descriptionEn!: string;

  @Column({ default: false })
  published!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}

@Entity('forum_announcements')
export class ForumAnnouncement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  titleTr!: string;

  @Column({ default: '' })
  titleEn!: string;

  @Column({ type: 'text', default: '' })
  contentTr!: string;

  @Column({ type: 'text', default: '' })
  contentEn!: string;

  @Column({ type: 'date' })
  publishedAt!: string;

  @Column({ default: false })
  published!: boolean;
}

@Entity('forum_sponsors')
export class ForumSponsor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  logoUrl?: string | null;

  @Column({ type: 'varchar', nullable: true })
  website?: string | null;

  @Column({ default: 'INVITED' })
  confirmation!: string;

  @Column({ default: false })
  published!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;
}
