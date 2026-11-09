import { PGlite } from '@electric-sql/pglite';
import { btree_gist } from '@electric-sql/pglite/contrib/btree_gist';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MIGRATION_SQL } from '../migrations/index.js';
import { PERMISSION_CODES, ROLE_DEFS } from './rbac-seed.js';

/** Geliştirme (kod) ve üretim (migration) rol/izin tanımlarının birbirinden sapmaması için. */
let db: PGlite;

beforeAll(async () => {
  db = new PGlite({ extensions: { btree_gist } });
  await db.waitReady;
  for (const m of MIGRATION_SQL) for (const sql of m.up) await db.exec(sql);
}, 60_000);

afterAll(async () => {
  await db.close();
});

describe('rbac-seed ile migration aynı', () => {
  it('izin kodları aynı', async () => {
    const rows = await db.query<{ code: string }>(`SELECT code FROM permissions ORDER BY code`);
    expect(rows.rows.map((r) => r.code)).toEqual(PERMISSION_CODES.map((p) => p[0]).sort());
  });

  it('roller, kapsamları ve izin kümeleri aynı', async () => {
    const rows = await db.query<{ code: string; scope: string; perms: string[] }>(
      `SELECT r.code, r.scope,
              COALESCE(array_agg(p.code ORDER BY p.code) FILTER (WHERE p.code IS NOT NULL), '{}') AS perms
       FROM roles r
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       GROUP BY r.code, r.scope ORDER BY r.code`,
    );
    const all = PERMISSION_CODES.map((p) => p[0]);
    const expected = ROLE_DEFS.map((d) => ({
      code: d.code,
      scope: d.scope,
      perms: [...(d.permissions === 'ALL' ? all : d.permissions)].sort(),
    })).sort((a, b) => a.code.localeCompare(b.code));
    expect(rows.rows).toEqual(expected);
  });
});
