import { PGlite } from '@electric-sql/pglite';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MIGRATION_SQL } from '../migrations/index.js';
import { BookingsService, TRANSITIONS, type Db } from './bookings.service.js';
import { SchedulingService } from './scheduling.service.js';

let pg: PGlite;
let bookings: BookingsService;
let scheduling: SchedulingService;
const actor = { userId: null, label: 'test', ip: '1.1.1.1' };
const audit = { log: async () => undefined };

const db: Db = {
  query: async <T>(sql: string, params?: unknown[]) => (await pg.query(sql, params)).rows as T[],
  transaction: (fn) =>
    pg.transaction((tx) => fn({ query: async <T>(sql: string, params?: unknown[]) => (await tx.query(sql, params)).rows as T[] })),
};

beforeAll(async () => {
  pg = await PGlite.create({ extensions: { btree_gist } });
  for (const m of MIGRATION_SQL) for (const s of m.up) await pg.exec(s);
  bookings = new BookingsService(db, audit);
  scheduling = new SchedulingService(db, audit);
  await scheduling.createType({ code: 'SAHA', name: 'Saha' }, actor);
});

afterAll(async () => {
  await pg.close();
});

let seq = 0;
const newResource = (over: { exclusive?: boolean; quantity?: number } = {}) =>
  scheduling.createResource({ code: `K${++seq}`, name: `Kaynak ${seq}`, typeCode: 'SAHA', ...over }, actor);

const customer = { name: 'Test Kulübü', email: 'Test@Kulup.com', phone: '+905551112233' };
const item = (resourceId: string, from = '2027-06-01T09:00Z', to = '2027-06-01T11:00Z', quantity?: number) => ({ resourceId, from, to, quantity });

describe('talep oluşturma', () => {
  it('numara HIC-YYYY-NNNNNN, durum SUBMITTED, tahsis HELD, geçmiş kaydı oluşur', async () => {
    const r = await newResource();
    const created = await bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id)] }, actor);
    expect(created.number).toMatch(/^HIC-\d{4}-\d{6}$/);
    const b = await bookings.get(created.id);
    expect(b.status).toBe('SUBMITTED');
    expect(b.customerEmail).toBe('test@kulup.com');
    expect(b.allocations).toHaveLength(1);
    expect(b.allocations[0]).toMatchObject({ status: 'HELD', quantity: 1 });
    expect(b.history).toHaveLength(1);
  });

  it('aynı kaynak/aralık ikinci kez alınamaz (409), bitişik aralık alınır', async () => {
    const r = await newResource();
    await bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id)] }, actor);
    await expect(bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id, '2027-06-01T10:00Z', '2027-06-01T12:00Z')] }, actor)).rejects.toBeInstanceOf(ConflictException);
    await expect(bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id, '2027-06-01T11:00Z', '2027-06-01T13:00Z')] }, actor)).resolves.toBeTruthy();
  });

  it('kalemlerden biri başarısızsa hiçbir kayıt ve numara harcanmaz (atomik)', async () => {
    const free = await newResource();
    const taken = await newResource();
    await bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(taken.id)] }, actor);
    const before = await pg.query<{ c: number }>(`SELECT count(*)::int AS c FROM bookings`);
    const num = await pg.query<{ last_value: number }>(`SELECT last_value FROM booking_numbers`);
    await expect(
      bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(free.id), item(taken.id)] }, actor),
    ).rejects.toBeInstanceOf(ConflictException);
    expect((await pg.query<{ c: number }>(`SELECT count(*)::int AS c FROM bookings`)).rows[0].c).toBe(before.rows[0].c);
    expect((await pg.query<{ last_value: number }>(`SELECT last_value FROM booking_numbers`)).rows[0].last_value).toBe(num.rows[0].last_value);
    // Serbest kaynak da tahsis edilmemiş olmalı.
    expect((await scheduling.availability(free.id, '2027-06-01T09:00Z', '2027-06-01T11:00Z')).available).toBe(true);
  });

  it('adetli kaynakta kapasite aşımı 409; boş kalem listesi 400', async () => {
    const r = await newResource({ exclusive: false, quantity: 5 });
    await bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id, undefined, undefined, 4)] }, actor);
    await expect(bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id, undefined, undefined, 2)] }, actor)).rejects.toThrow(/kapasite/);
    await expect(bookings.create({ source: 'ADMIN_PANEL', customer, items: [] }, actor)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('bakımdaki kaynak için talep reddedilir', async () => {
    const r = await newResource();
    await scheduling.updateResource(r.id, { maintenanceStatus: 'MAINTENANCE' }, actor);
    await expect(bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id)] }, actor)).rejects.toThrow(/bakım/);
  });
});

describe('durum geçişleri', () => {
  it('onay tahsisi CONFIRMED yapar; iptal serbest bırakır ve kaynak yeniden müsait olur', async () => {
    const r = await newResource();
    const { id } = await bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id)] }, actor);
    const confirmed = await bookings.transition(id, 'CONFIRMED', 'Onaylandı', actor);
    expect(confirmed.allocations[0]).toMatchObject({ status: 'CONFIRMED', holdExpiresAt: null });
    expect((await scheduling.availability(r.id, '2027-06-01T09:00Z', '2027-06-01T11:00Z')).available).toBe(false);
    const cancelled = await bookings.transition(id, 'CANCELLED', 'Müşteri vazgeçti', actor);
    expect(cancelled.allocations[0].status).toBe('RELEASED');
    expect((await scheduling.availability(r.id, '2027-06-01T09:00Z', '2027-06-01T11:00Z')).available).toBe(true);
    expect(cancelled.history.map((h: { to: string }) => h.to)).toEqual(['SUBMITTED', 'CONFIRMED', 'CANCELLED']);
  });

  it('izin verilmeyen geçiş 409; son durumlardan çıkış yok', async () => {
    const r = await newResource();
    const { id } = await bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id)] }, actor);
    await expect(bookings.transition(id, 'COMPLETED', '', actor)).rejects.toBeInstanceOf(ConflictException);
    await bookings.transition(id, 'REJECTED', 'Uygun değil', actor);
    await expect(bookings.transition(id, 'CONFIRMED', '', actor)).rejects.toBeInstanceOf(ConflictException);
    for (const s of ['COMPLETED', 'CANCELLED', 'REJECTED', 'EXPIRED'] as const) expect(TRANSITIONS[s]).toEqual([]);
  });

  it('süresi dolmuş tutma onaylanamaz; expireHolds talebi EXPIRED yapar', async () => {
    const r = await newResource();
    const { id } = await bookings.create({ source: 'ADMIN_PANEL', customer, items: [item(r.id)] }, actor);
    await pg.query(`UPDATE resource_allocations SET hold_expires_at = now() - interval '1 hour' WHERE booking_id = $1`, [id]);
    await expect(bookings.transition(id, 'CONFIRMED', '', actor)).rejects.toThrow(/süresi dolmuş/);
    expect(await bookings.expireHolds()).toBeGreaterThanOrEqual(1);
    expect((await bookings.get(id)).status).toBe('EXPIRED');
    expect((await scheduling.availability(r.id, '2027-06-01T09:00Z', '2027-06-01T11:00Z')).available).toBe(true);
  });
});

describe('eşzamanlılık', () => {
  it('aynı anda gelen iki talepten yalnızca biri kazanır', async () => {
    const r = await newResource();
    const attempt = () => bookings.create({ source: 'B2C_WEBSITE', customer, items: [item(r.id, '2027-07-01T09:00Z', '2027-07-01T11:00Z')] }, actor);
    const results = await Promise.allSettled([attempt(), attempt(), attempt()]);
    expect(results.filter((x) => x.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((x) => x.status === 'rejected')).toHaveLength(2);
  });
});
