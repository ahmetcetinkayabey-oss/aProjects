import { PGlite } from '@electric-sql/pglite';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MIGRATION_SQL } from '../migrations/index.js';
import { SchedulingService, parsePeriod, type Sql } from './scheduling.service.js';

let db: PGlite;
let svc: SchedulingService;
const logged: string[] = [];
const actor = { userId: null, label: 'test', ip: '1.1.1.1' };

const sql: Sql = {
  query: async <T>(text: string, params?: unknown[]) => (await db.query(text, params)).rows as T[],
};

beforeAll(async () => {
  db = await PGlite.create({ extensions: { btree_gist } });
  for (const m of MIGRATION_SQL) for (const s of m.up) await db.exec(s);
  svc = new SchedulingService(sql, { log: async (e) => void logged.push(e.action) });
  await svc.createType({ code: 'saha', name: 'Saha' }, actor);
  await svc.createType({ code: 'EKIPMAN', name: 'Ekipman', capacityUnit: 'adet' }, actor);
});

afterAll(async () => {
  await db.close();
});

async function bookingId(): Promise<string> {
  const c = await db.query<{ id: string }>(`INSERT INTO customers (kind, display_name) VALUES ('INDIVIDUAL','T') RETURNING id`);
  const n = await db.query<{ n: string }>(`SELECT next_booking_number(2026) AS n`);
  const b = await db.query<{ id: string }>(
    `INSERT INTO bookings (number, source, customer_id) VALUES ($1,'ADMIN_PANEL',$2) RETURNING id`,
    [n.rows[0].n, c.rows[0].id],
  );
  return b.rows[0].id;
}

const alloc = (rid: string, bid: string, from: string, to: string, quantity = 1) =>
  db.query(
    `INSERT INTO resource_allocations (resource_id, booking_id, period, quantity, status)
     VALUES ($1,$2,tstzrange($3::timestamptz,$4::timestamptz,'[)'),$5,'CONFIRMED')`,
    [rid, bid, from, to, quantity],
  );

describe('kaynak yönetimi', () => {
  it('kod büyük harfe çevrilir; tekrar eden kod 409; bilinmeyen tür 400', async () => {
    const r = await svc.createResource({ code: 'saha-1', name: 'Ana Saha', typeCode: 'SAHA', isDemo: true }, actor);
    expect(r.code).toBe('SAHA-1');
    expect(r.typeCode).toBe('SAHA');
    await expect(svc.createResource({ code: 'saha-1', name: 'x', typeCode: 'SAHA' }, actor)).rejects.toBeInstanceOf(ConflictException);
    await expect(svc.createResource({ code: 'yeni', name: 'x', typeCode: 'YOK' }, actor)).rejects.toBeInstanceOf(BadRequestException);
    expect(logged).toContain('resource.create');
  });

  it('güncelleme yalnızca verilen alanları değiştirir; negatif kapasite reddedilir', async () => {
    const r = await svc.createResource({ code: 'saha-2', name: 'İkinci', typeCode: 'SAHA', capacity: 22 }, actor);
    const u = await svc.updateResource(r.id, { name: 'İkinci Saha' }, actor);
    expect(u.name).toBe('İkinci Saha');
    expect(u.capacity).toBe(22);
    await expect(svc.updateResource(r.id, { quantity: -1 }, actor)).rejects.toBeInstanceOf(BadRequestException);
    await expect(svc.getResource('00000000-0000-0000-0000-000000000000')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('pasif kaynak varsayılan listede görünmez', async () => {
    const r = await svc.createResource({ code: 'eski', name: 'Eski', typeCode: 'SAHA' }, actor);
    await svc.updateResource(r.id, { active: false }, actor);
    expect((await svc.listResources()).some((x) => x.code === 'ESKI')).toBe(false);
    expect((await svc.listResources({ includeInactive: true })).some((x) => x.code === 'ESKI')).toBe(true);
  });
});

describe('müsaitlik', () => {
  it('tek-kullanımlı kaynak: aralık doluyken BOOKED, bitişik aralık müsait', async () => {
    const r = await svc.createResource({ code: 'oda-1', name: 'Oda', typeCode: 'SAHA' }, actor);
    await alloc(r.id, await bookingId(), '2027-01-10T10:00Z', '2027-01-10T12:00Z');
    const busy = await svc.availability(r.id, '2027-01-10T11:00Z', '2027-01-10T13:00Z');
    expect(busy.available).toBe(false);
    expect(busy.reasons).toEqual(['BOOKED']);
    // Aralıklar yarı açık: 12:00'de biten ile 12:00'de başlayan çakışmaz.
    expect((await svc.availability(r.id, '2027-01-10T12:00Z', '2027-01-10T14:00Z')).available).toBe(true);
  });

  it('adetli kaynak: kalan adet doğru hesaplanır, dolunca CAPACITY', async () => {
    const r = await svc.createResource({ code: 'kayak', name: 'Kayak', typeCode: 'EKIPMAN', quantity: 10, exclusive: false }, actor);
    await alloc(r.id, await bookingId(), '2027-02-01T00:00Z', '2027-02-02T00:00Z', 7);
    const a = await svc.availability(r.id, '2027-02-01T06:00Z', '2027-02-01T18:00Z');
    expect(a).toMatchObject({ available: true, remaining: 3 });
    await alloc(r.id, await bookingId(), '2027-02-01T00:00Z', '2027-02-02T00:00Z', 3);
    const full = await svc.availability(r.id, '2027-02-01T06:00Z', '2027-02-01T18:00Z');
    expect(full).toMatchObject({ available: false, remaining: 0, reasons: ['CAPACITY'] });
  });

  it('süresi dolmuş geçici blokaj müsaitliği engellemez', async () => {
    const r = await svc.createResource({ code: 'salon', name: 'Salon', typeCode: 'SAHA' }, actor);
    await db.query(
      `INSERT INTO resource_allocations (resource_id, booking_id, period, status, hold_expires_at)
       VALUES ($1,$2,tstzrange('2027-03-01T10:00Z','2027-03-01T12:00Z','[)'),'HELD', now() - interval '1 hour')`,
      [r.id, await bookingId()],
    );
    expect((await svc.availability(r.id, '2027-03-01T10:00Z', '2027-03-01T12:00Z')).available).toBe(true);
  });

  it('bakım durumu ve blokaj kaynağı kapatır; blokaj silinince açılır', async () => {
    const r = await svc.createResource({ code: 'havuz', name: 'Havuz', typeCode: 'SAHA' }, actor);
    const b = await svc.createBlock(r.id, { from: '2027-04-01T00:00Z', to: '2027-04-03T00:00Z', kind: 'MAINTENANCE', reason: 'Temizlik' }, actor);
    const blocked = await svc.availability(r.id, '2027-04-02T00:00Z', '2027-04-02T06:00Z');
    expect(blocked).toMatchObject({ available: false, remaining: 0, reasons: ['BLOCKED'] });
    expect(await svc.listBlocks(r.id)).toHaveLength(1);
    await svc.deleteBlock(r.id, b.id, actor);
    expect((await svc.availability(r.id, '2027-04-02T00:00Z', '2027-04-02T06:00Z')).available).toBe(true);
    await expect(svc.deleteBlock(r.id, b.id, actor)).rejects.toBeInstanceOf(NotFoundException);

    await svc.updateResource(r.id, { maintenanceStatus: 'CLOSED' }, actor);
    expect((await svc.availability(r.id, '2027-05-01T00:00Z', '2027-05-01T06:00Z')).reasons).toEqual(['MAINTENANCE']);
  });
});

describe('parsePeriod', () => {
  it('bozuk ya da ters aralığı reddeder', () => {
    expect(() => parsePeriod('x', '2027-01-01T00:00Z')).toThrow(BadRequestException);
    expect(() => parsePeriod('2027-01-02T00:00Z', '2027-01-01T00:00Z')).toThrow(BadRequestException);
    expect(() => parsePeriod('2027-01-01T00:00Z', '2027-01-01T00:00Z')).toThrow(BadRequestException);
  });
});
