import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuditService } from '../identity/audit.service.js';
import type { Actor } from '../identity/identity.service.js';
import { parsePeriod, type Sql } from './scheduling.service.js';

/** Sql + işlem desteği. Üretimde TypeORM, testte PGlite bağlanır. */
export interface Db extends Sql {
  transaction<T>(fn: (tx: Sql) => Promise<T>): Promise<T>;
}

export type BookingStatus =
  | 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'QUOTATION_PREPARED' | 'AWAITING_CUSTOMER_APPROVAL'
  | 'AWAITING_ADMIN_APPROVAL' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED'
  | 'CANCELLATION_REQUESTED' | 'CANCELLED' | 'REJECTED' | 'EXPIRED';

/** İzin verilen durum geçişleri. Burada olmayan geçiş 409 döner. */
export const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['UNDER_REVIEW', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  UNDER_REVIEW: ['QUOTATION_PREPARED', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  QUOTATION_PREPARED: ['AWAITING_CUSTOMER_APPROVAL', 'REJECTED', 'CANCELLED'],
  AWAITING_CUSTOMER_APPROVAL: ['AWAITING_ADMIN_APPROVAL', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED'],
  AWAITING_ADMIN_APPROVAL: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLATION_REQUESTED', 'CANCELLED'],
  CHECKED_IN: ['IN_PROGRESS', 'COMPLETED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLATION_REQUESTED: ['CANCELLED', 'CONFIRMED'],
  CANCELLED: [],
  REJECTED: [],
  EXPIRED: [],
};

/** Tahsisleri serbest bırakan durumlar. */
const RELEASING: BookingStatus[] = ['CANCELLED', 'REJECTED', 'EXPIRED'];

export interface CreateBookingInput {
  source: 'B2C_WEBSITE' | 'B2B_PORTAL' | 'ADMIN_PANEL' | 'MANUAL_ENTRY';
  customer: { name: string; email?: string; phone?: string };
  startDate?: string;
  endDate?: string;
  participantCount?: number;
  notes?: string;
  /** Geçici tutma süresi (saat). Varsayılan politika onaylanana dek 24 saat; Q7 kararıyla yapılandırılacak. */
  holdHours?: number;
  items: Array<{ resourceId: string; from: string; to: string; quantity?: number }>;
}

export interface BookingDetail {
  id: string;
  number: string;
  source: string;
  status: BookingStatus;
  paymentStatus: string;
  startDate: string | null;
  endDate: string | null;
  participantCount: number | null;
  notes: string | null;
  createdAt: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  allocations: Array<{ id: string; resourceId: string; resourceName: string; quantity: number; status: string; from: string; to: string; holdExpiresAt: string | null }>;
  history: Array<{ from: BookingStatus | null; to: BookingStatus; note: string; at: string }>;
}

const DB_MESSAGES: Record<string, string> = {
  RESOURCE_UNAVAILABLE: 'Kaynak kullanılamıyor.',
  RESOURCE_IN_MAINTENANCE: 'Kaynak bakımda ya da kapalı.',
  RESOURCE_BLOCKED: 'Seçilen aralıkta kaynak bakım/kapatma nedeniyle kullanılamıyor.',
  CAPACITY_EXCEEDED: 'Seçilen aralıkta yeterli kapasite yok.',
  HOLD_EXPIRED: 'Geçici tutma süresi dolmuş; talep onaylanamaz.',
  ALLOCATION_ALREADY_RELEASED: 'Tahsis daha önce serbest bırakılmış.',
};

/** Veritabanı kural ihlallerini anlaşılır 409/400 hatalarına çevirir; diğer hataları olduğu gibi bırakır. */
export function mapBookingError(e: unknown): Error {
  const err = e as { message?: string; code?: string };
  for (const [key, text] of Object.entries(DB_MESSAGES)) {
    if (err?.message?.includes(key)) return new ConflictException(text);
  }
  if (err?.code === '23P01') return new ConflictException('Seçilen aralıkta kaynak zaten tahsis edilmiş.');
  if (err?.code === '23514' || err?.code === '22P02') return new BadRequestException('Geçersiz değer.');
  return e as Error;
}

@Injectable()
export class BookingsService {
  constructor(
    private readonly db: Db,
    private readonly audit: Pick<AuditService, 'log'>,
  ) {}

  /**
   * Talebi ve kaynak tahsislerini TEK işlemde oluşturur. Herhangi bir kaynak uygun değilse
   * hiçbir şey kaydedilmez (rezervasyon numarası da harcanmaz). Çakışma garantisi veritabanı trigger'ındadır.
   */
  async create(input: CreateBookingInput, actor: Actor) {
    if (!input.items.length) throw new BadRequestException('En az bir kaynak seçin.');
    const periods = input.items.map((i) => ({ ...i, p: parsePeriod(i.from, i.to) }));
    const holdHours = Math.min(Math.max(input.holdHours ?? 24, 1), 24 * 30);
    try {
      const result = await this.db.transaction(async (tx) => {
        const [customer] = await tx.query<{ id: string }>(
          `INSERT INTO customers (kind, display_name, email, phone) VALUES ('INDIVIDUAL',$1,$2,$3) RETURNING id`,
          [input.customer.name.trim(), input.customer.email?.trim().toLowerCase() ?? null, input.customer.phone ?? null],
        );
        const [num] = await tx.query<{ n: string }>(`SELECT next_booking_number($1::int) AS n`, [new Date().getUTCFullYear()]);
        const [booking] = await tx.query<{ id: string }>(
          `INSERT INTO bookings (number, source, customer_id, status, start_date, end_date, participant_count, notes, created_by)
           VALUES ($1,$2,$3,'SUBMITTED',$4,$5,$6,$7,$8) RETURNING id`,
          [num.n, input.source, customer.id, input.startDate ?? null, input.endDate ?? null, input.participantCount ?? null, input.notes ?? null, actor.userId],
        );
        for (const it of periods) {
          await tx.query(
            `INSERT INTO resource_allocations (resource_id, booking_id, period, quantity, status, hold_expires_at)
             VALUES ($1,$2,tstzrange($3::timestamptz,$4::timestamptz,'[)'),$5,'HELD', now() + make_interval(hours => $6::int))`,
            [it.resourceId, booking.id, it.p.from.toISOString(), it.p.to.toISOString(), it.quantity ?? 1, holdHours],
          );
        }
        await tx.query(
          `INSERT INTO booking_status_history (booking_id, from_status, to_status, user_id, note) VALUES ($1,NULL,'SUBMITTED',$2,'Talep oluşturuldu')`,
          [booking.id, actor.userId],
        );
        return { id: booking.id, number: num.n };
      });
      await this.audit.log({ userId: actor.userId, actorLabel: actor.label, ip: actor.ip, action: 'booking.create', entity: 'booking', entityId: result.id, after: { number: result.number, items: input.items.length } });
      return result;
    } catch (e) {
      throw mapBookingError(e);
    }
  }

  async get(id: string): Promise<BookingDetail> {
    const rows = await this.db.query<Omit<BookingDetail, 'allocations' | 'history'>>(
      `SELECT b.id, b.number, b.source, b.status, b.payment_status AS "paymentStatus", b.start_date AS "startDate",
              b.end_date AS "endDate", b.participant_count AS "participantCount", b.notes, b.created_at AS "createdAt",
              c.display_name AS "customerName", c.email AS "customerEmail", c.phone AS "customerPhone"
         FROM bookings b JOIN customers c ON c.id = b.customer_id WHERE b.id = $1`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Rezervasyon bulunamadı.');
    const allocations = await this.db.query<BookingDetail['allocations'][number]>(
      `SELECT a.id, a.resource_id AS "resourceId", r.name AS "resourceName", a.quantity, a.status,
              lower(a.period) AS "from", upper(a.period) AS "to", a.hold_expires_at AS "holdExpiresAt"
         FROM resource_allocations a JOIN resources r ON r.id = a.resource_id WHERE a.booking_id = $1 ORDER BY lower(a.period)`,
      [id],
    );
    const history = await this.db.query<BookingDetail['history'][number]>(
      `SELECT from_status AS "from", to_status AS "to", note, at FROM booking_status_history WHERE booking_id = $1 ORDER BY at, id`,
      [id],
    );
    return { ...rows[0], allocations, history };
  }

  list(opts: { status?: string; page?: number; pageSize?: number } = {}) {
    const page = Math.max(opts.page ?? 1, 1);
    const size = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
    const params: unknown[] = [];
    let where = '';
    if (opts.status) {
      params.push(opts.status);
      where = `WHERE b.status = $1`;
    }
    params.push(size, (page - 1) * size);
    return this.db.query(
      `SELECT b.id, b.number, b.status, b.start_date AS "startDate", b.end_date AS "endDate", c.display_name AS "customerName", b.created_at AS "createdAt"
         FROM bookings b JOIN customers c ON c.id = b.customer_id ${where}
        ORDER BY b.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
  }

  /** Durum geçişi: izin verilen geçiş kontrolü, tahsis onayı/serbest bırakma ve geçmiş kaydı tek işlemde. */
  async transition(id: string, to: BookingStatus, note: string, actor: Actor) {
    try {
      const from = await this.db.transaction(async (tx) => {
        const rows = await tx.query<{ status: BookingStatus }>(`SELECT status FROM bookings WHERE id = $1 FOR UPDATE`, [id]);
        if (!rows[0]) throw new NotFoundException('Rezervasyon bulunamadı.');
        const current = rows[0].status;
        if (!TRANSITIONS[current]?.includes(to)) {
          throw new ConflictException(`“${current}” durumundan “${to}” durumuna geçilemez.`);
        }
        if (to === 'CONFIRMED') {
          // Süresi dolmuş tutma onaylanamaz: veritabanı trigger'ı HOLD_EXPIRED fırlatır.
          await tx.query(`UPDATE resource_allocations SET status = 'CONFIRMED', hold_expires_at = NULL WHERE booking_id = $1 AND status = 'HELD'`, [id]);
        } else if (RELEASING.includes(to)) {
          await tx.query(`UPDATE resource_allocations SET status = 'RELEASED' WHERE booking_id = $1 AND status <> 'RELEASED'`, [id]);
        }
        await tx.query(`UPDATE bookings SET status = $2, updated_at = now() WHERE id = $1`, [id, to]);
        await tx.query(
          `INSERT INTO booking_status_history (booking_id, from_status, to_status, user_id, note) VALUES ($1,$2,$3,$4,$5)`,
          [id, current, to, actor.userId, note.slice(0, 500)],
        );
        return current;
      });
      await this.audit.log({ userId: actor.userId, actorLabel: actor.label, ip: actor.ip, action: 'booking.transition', entity: 'booking', entityId: id, before: { status: from }, after: { status: to } });
      return this.get(id);
    } catch (e) {
      throw mapBookingError(e);
    }
  }

  /** Süresi dolan geçici tutmaları serbest bırakır ve hiç tahsisi kalmayan SUBMITTED talepleri EXPIRED yapar. */
  async expireHolds(): Promise<number> {
    return this.db.transaction(async (tx) => {
      await tx.query(`UPDATE resource_allocations SET status = 'RELEASED' WHERE status = 'HELD' AND hold_expires_at < now()`);
      const expired = await tx.query<{ id: string }>(
        `UPDATE bookings b SET status = 'EXPIRED', updated_at = now()
          WHERE b.status = 'SUBMITTED'
            AND EXISTS (SELECT 1 FROM resource_allocations a WHERE a.booking_id = b.id)
            AND NOT EXISTS (SELECT 1 FROM resource_allocations a WHERE a.booking_id = b.id AND a.status <> 'RELEASED')
        RETURNING b.id`,
      );
      for (const r of expired) {
        await tx.query(
          `INSERT INTO booking_status_history (booking_id, from_status, to_status, note) VALUES ($1,'SUBMITTED','EXPIRED','Tutma süresi doldu')`,
          [r.id],
        );
      }
      return expired.length;
    });
  }
}

@Injectable()
export class TypeOrmBookingsService extends BookingsService {
  constructor(@InjectDataSource() ds: DataSource, audit: AuditService) {
    super(
      {
        query: (sql, params) => ds.query(sql, params),
        transaction: (fn) => ds.transaction((m) => fn({ query: (sql, params) => m.query(sql, params) })),
      },
      audit,
    );
  }
}
