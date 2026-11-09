import { PGlite } from '@electric-sql/pglite';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MIGRATION_SQL } from './index.js';

/**
 * Gerçek PostgreSQL motoru (PGlite, süreç içi) üzerinde migration ve veritabanı düzeyi iş kuralları.
 * Eşzamanlılık/çakışma garantisi uygulama koduna değil SQL'e dayandığı için burada doğrulanır.
 */
let db: PGlite;

async function runAll(direction: 'up' | 'down') {
  const list = direction === 'up' ? MIGRATION_SQL : [...MIGRATION_SQL].reverse();
  for (const m of list) for (const sql of m[direction]) await db.exec(sql);
}

const range = (from: string, to: string) => `[${from},${to})`;

async function newBooking(): Promise<string> {
  const c = await db.query<{ id: string }>(
    `INSERT INTO customers (kind, display_name) VALUES ('INDIVIDUAL','Test') RETURNING id`,
  );
  const n = await db.query<{ n: string }>(`SELECT next_booking_number(2026) AS n`);
  const b = await db.query<{ id: string }>(
    `INSERT INTO bookings (number, source, customer_id) VALUES ($1,'ADMIN_PANEL',$2) RETURNING id`,
    [n.rows[0].n, c.rows[0].id],
  );
  return b.rows[0].id;
}

async function newResource(opts: { exclusive: boolean; quantity?: number; code: string }): Promise<string> {
  const t = await db.query<{ id: string }>(
    `INSERT INTO resource_types (code, name) VALUES ($1,'Tür') ON CONFLICT (code) DO UPDATE SET name='Tür' RETURNING id`,
    ['T-' + opts.code],
  );
  const r = await db.query<{ id: string }>(
    `INSERT INTO resources (code, name, type_id, quantity, exclusive, is_demo) VALUES ($1,'Demo',$2,$3,$4,true) RETURNING id`,
    [opts.code, t.rows[0].id, opts.quantity ?? 1, opts.exclusive],
  );
  return r.rows[0].id;
}

function allocate(
  resourceId: string,
  bookingId: string,
  period: string,
  extra: { quantity?: number; status?: string; expires?: string } = {},
) {
  return db.query(
    `INSERT INTO resource_allocations (resource_id, booking_id, period, quantity, status, hold_expires_at)
     VALUES ($1,$2,$3::tstzrange,$4,$5,$6)`,
    [
      resourceId,
      bookingId,
      period,
      extra.quantity ?? 1,
      extra.status ?? 'CONFIRMED',
      extra.expires ?? null,
    ],
  );
}

beforeAll(async () => {
  db = new PGlite({ extensions: { btree_gist } });
  await db.waitReady;
  await runAll('up');
}, 60_000);

afterAll(async () => {
  await db.close();
});

describe('migration up/down', () => {
  it('geri alınabilir ve yeniden uygulanabilir (temiz geri alma)', async () => {
    await runAll('down');
    const left = await db.query<{ n: string }>(
      `SELECT count(*)::text AS n FROM pg_tables WHERE schemaname='public'`,
    );
    expect(left.rows[0].n).toBe('0');
    await runAll('up');
    const after = await db.query<{ n: string }>(
      `SELECT count(*)::text AS n FROM pg_tables WHERE schemaname='public'`,
    );
    expect(Number(after.rows[0].n)).toBeGreaterThan(15);
  }, 60_000);
});

describe('001 temel katman', () => {
  it('10 sistem rolü tanımlı; sistem yöneticisi tüm izinlere sahip', async () => {
    const roles = await db.query<{ n: string }>(`SELECT count(*)::text AS n FROM roles`);
    expect(roles.rows[0].n).toBe('10');
    const missing = await db.query(
      `SELECT p.code FROM permissions p WHERE NOT EXISTS (
         SELECT 1 FROM role_permissions rp JOIN roles r ON r.id = rp.role_id
         WHERE rp.permission_id = p.id AND r.code = 'SYSTEM_ADMIN')`,
    );
    expect(missing.rows).toHaveLength(0);
  });

  it('bireysel müşteri finans yazamaz, B2B muhasebe yalnız görüntüler', async () => {
    const perms = async (role: string) =>
      (
        await db.query<{ code: string }>(
          `SELECT p.code FROM role_permissions rp JOIN roles r ON r.id=rp.role_id
           JOIN permissions p ON p.id=rp.permission_id WHERE r.code=$1`,
          [role],
        )
      ).rows.map((r) => r.code);
    expect(await perms('INDIVIDUAL_CUSTOMER')).not.toContain('finance:record');
    const acc = await perms('B2B_ACCOUNTANT');
    expect(acc).toContain('finance:view');
    expect(acc).not.toContain('finance:record');
    expect(acc).not.toContain('booking:approve');
  });

  it('e-posta büyük/küçük harfe duyarsız benzersiz', async () => {
    await db.query(
      `INSERT INTO users (email, full_name, user_type) VALUES ('A@Test.com','A','B2C')`,
    );
    await expect(
      db.query(`INSERT INTO users (email, full_name, user_type) VALUES ('a@test.COM','B','B2C')`),
    ).rejects.toThrow();
  });

  it('kurum kipi ile yetki bayrakları çelişemez', async () => {
    await expect(
      db.query(
        `INSERT INTO organizations (code, name, reservation_mode, can_create_direct_booking, can_submit_request)
         VALUES ('ORG-X','X','REQUEST_BASED', true, true)`,
      ),
    ).rejects.toThrow();
    await db.query(
      `INSERT INTO organizations (code, name, reservation_mode, can_create_direct_booking, can_submit_request)
       VALUES ('ORG-H','H','HYBRID', true, true)`,
    );
  });

  it('kurum müşterisi kuruma, bireysel müşteri kurumsuz olmalı; kurum başına tek müşteri', async () => {
    const org = await db.query<{ id: string }>(
      `INSERT INTO organizations (code, name) VALUES ('ORG-C','C') RETURNING id`,
    );
    await expect(
      db.query(`INSERT INTO customers (kind, display_name) VALUES ('ORGANIZATION','Kurumsuz')`),
    ).rejects.toThrow();
    await db.query(
      `INSERT INTO customers (kind, organization_id, display_name) VALUES ('ORGANIZATION',$1,'C')`,
      [org.rows[0].id],
    );
    await expect(
      db.query(
        `INSERT INTO customers (kind, organization_id, display_name) VALUES ('ORGANIZATION',$1,'C2')`,
        [org.rows[0].id],
      ),
    ).rejects.toThrow();
  });

  it('audit log eklenir ama değiştirilemez ve silinemez', async () => {
    await db.query(`INSERT INTO audit_logs (action, entity) VALUES ('TEST','x')`);
    await expect(db.query(`UPDATE audit_logs SET action='HACK'`)).rejects.toThrow(/degistirilemez/);
    await expect(db.query(`DELETE FROM audit_logs`)).rejects.toThrow(/degistirilemez/);
  });
});

describe('002 rezervasyon numarası', () => {
  it('HIC-YYYY-NNNNNN biçiminde, ardışık ve yıla göre ayrı', async () => {
    const a = (await db.query<{ n: string }>(`SELECT next_booking_number(2031) AS n`)).rows[0].n;
    const b = (await db.query<{ n: string }>(`SELECT next_booking_number(2031) AS n`)).rows[0].n;
    const c = (await db.query<{ n: string }>(`SELECT next_booking_number(2032) AS n`)).rows[0].n;
    expect(a).toBe('HIC-2031-000001');
    expect(b).toBe('HIC-2031-000002');
    expect(c).toBe('HIC-2032-000001');
  });
});

describe('002 kaynak tahsisi (kapasite ve çakışma)', () => {
  it('tek-kullanımlı kaynakta çakışan tahsis reddedilir, bitişik aralık kabul edilir', async () => {
    const res = await newResource({ exclusive: true, code: 'SAHA-1' });
    const b = await newBooking();
    await allocate(res, b, range('2027-04-16 09:00+00', '2027-04-16 11:00+00'));
    await expect(
      allocate(res, b, range('2027-04-16 10:00+00', '2027-04-16 12:00+00')),
    ).rejects.toThrow(/resource_allocations_no_overlap/);
    await allocate(res, b, range('2027-04-16 11:00+00', '2027-04-16 12:00+00'));
  });

  it('adet-tabanlı kaynakta toplam kapasite aşılamaz', async () => {
    const res = await newResource({ exclusive: false, quantity: 10, code: 'YEMEK-1' });
    const b = await newBooking();
    const p = range('2027-04-16 12:00+00', '2027-04-16 13:00+00');
    await allocate(res, b, p, { quantity: 6 });
    await expect(allocate(res, b, p, { quantity: 5 })).rejects.toThrow(/CAPACITY_EXCEEDED/);
    await allocate(res, b, p, { quantity: 4 });
  });

  it('bakımdaki kaynak ve bakım/kapatma bloğu olan aralık rezerve edilemez', async () => {
    const maint = await newResource({ exclusive: true, code: 'SAHA-BAKIM' });
    await db.query(`UPDATE resources SET maintenance_status='MAINTENANCE' WHERE id=$1`, [maint]);
    const b = await newBooking();
    await expect(
      allocate(maint, b, range('2027-05-01 09:00+00', '2027-05-01 10:00+00')),
    ).rejects.toThrow(/RESOURCE_IN_MAINTENANCE/);

    const blocked = await newResource({ exclusive: true, code: 'SAHA-BLOK' });
    await db.query(
      `INSERT INTO resource_blocks (resource_id, period, kind) VALUES ($1,$2::tstzrange,'CLOSED')`,
      [blocked, range('2027-05-02 00:00+00', '2027-05-03 00:00+00')],
    );
    await expect(
      allocate(blocked, b, range('2027-05-02 10:00+00', '2027-05-02 11:00+00')),
    ).rejects.toThrow(/RESOURCE_BLOCKED/);
    await allocate(blocked, b, range('2027-05-03 10:00+00', '2027-05-03 11:00+00'));
  });

  it('serbest bırakılan tahsis aralığı yeniden kullanılabilir yapar', async () => {
    const res = await newResource({ exclusive: true, code: 'SAHA-REL' });
    const b = await newBooking();
    const p = range('2027-06-01 09:00+00', '2027-06-01 10:00+00');
    await allocate(res, b, p);
    await expect(allocate(res, b, p)).rejects.toThrow(/no_overlap/);
    await db.query(`UPDATE resource_allocations SET status='RELEASED' WHERE resource_id=$1`, [res]);
    await allocate(res, b, p);
  });

  it('süresi dolan geçici blokaj otomatik bırakılır; dolmuş blokaj onaylanamaz', async () => {
    const res = await newResource({ exclusive: true, code: 'SAHA-HOLD' });
    const b = await newBooking();
    const p = range('2027-07-01 09:00+00', '2027-07-01 10:00+00');
    await allocate(res, b, p, { status: 'HELD', expires: '2020-01-01 00:00+00' });
    // Süresi geçmiş blokaj yeni tahsisi engellemez.
    await allocate(res, b, p);
    const expired = await db.query<{ status: string }>(
      `SELECT status FROM resource_allocations WHERE resource_id=$1 AND hold_expires_at IS NOT NULL`,
      [res],
    );
    expect(expired.rows[0].status).toBe('RELEASED');
    // Bırakılmış blokaj geri onaylanamaz.
    await expect(
      db.query(`UPDATE resource_allocations SET status='CONFIRMED' WHERE resource_id=$1 AND hold_expires_at IS NOT NULL`, [res]),
    ).rejects.toThrow(/ALLOCATION_ALREADY_RELEASED/);
  });

  it('geçerli HELD blokaj aralığı tutar', async () => {
    const res = await newResource({ exclusive: true, code: 'SAHA-HELD2' });
    const b = await newBooking();
    const p = range('2027-08-01 09:00+00', '2027-08-01 10:00+00');
    await allocate(res, b, p, { status: 'HELD', expires: '2099-01-01 00:00+00' });
    await expect(allocate(res, b, p)).rejects.toThrow(/no_overlap/);
  });
});
