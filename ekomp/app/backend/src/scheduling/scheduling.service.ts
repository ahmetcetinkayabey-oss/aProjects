import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuditService } from '../identity/audit.service.js';
import type { Actor } from '../identity/identity.service.js';

/** Servisin ihtiyaç duyduğu en küçük SQL arayüzü: üretimde TypeORM, testte PGlite bağlanır. */
export interface Sql {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
}

export interface ResourceRow {
  id: string;
  code: string;
  name: string;
  typeId: string;
  typeCode: string;
  capacity: number;
  quantity: number;
  exclusive: boolean;
  maintenanceStatus: 'OK' | 'MAINTENANCE' | 'CLOSED';
  isDemo: boolean;
  active: boolean;
}

export interface CreateResourceInput {
  code: string;
  name: string;
  typeCode: string;
  capacity?: number;
  quantity?: number;
  exclusive?: boolean;
  isDemo?: boolean;
}

export interface UpdateResourceInput {
  name?: string;
  capacity?: number;
  quantity?: number;
  exclusive?: boolean;
  maintenanceStatus?: 'OK' | 'MAINTENANCE' | 'CLOSED';
  active?: boolean;
}

export interface Availability {
  resourceId: string;
  from: string;
  to: string;
  available: boolean;
  /** Kullanılabilir adet (tek-kullanımlı kaynakta 0 ya da 1). */
  remaining: number;
  reasons: Array<'INACTIVE' | 'MAINTENANCE' | 'BLOCKED' | 'BOOKED' | 'CAPACITY'>;
}

const RESOURCE_SELECT = `
  SELECT r.id, r.code, r.name, r.type_id AS "typeId", t.code AS "typeCode", r.capacity, r.quantity,
         r.exclusive, r.maintenance_status AS "maintenanceStatus", r.is_demo AS "isDemo", r.active
    FROM resources r JOIN resource_types t ON t.id = r.type_id`;

/** Zaman aralığı doğrulaması: ISO tarih-saat, bitiş > başlangıç. Aralık [from, to) yarı açıktır. */
export function parsePeriod(from: string, to: string): { from: Date; to: Date } {
  const f = new Date(from);
  const t = new Date(to);
  if (Number.isNaN(f.getTime()) || Number.isNaN(t.getTime())) {
    throw new BadRequestException('Geçerli bir başlangıç ve bitiş zamanı girin.');
  }
  if (t <= f) throw new BadRequestException('Bitiş zamanı başlangıçtan sonra olmalı.');
  return { from: f, to: t };
}

/**
 * Hizmet/kaynak yönetimi ve müsaitlik sorgusu. PostgreSQL'e özgü (tstzrange) olduğundan
 * geliştirmedeki SQLite'ta çalışmaz; SchedulingModule yalnızca PostgreSQL'de etkinleşir.
 * Çakışma ve kapasite GARANTİSİ burada değil, 002 migration'ındaki trigger/exclusion'dadır.
 */
@Injectable()
export class SchedulingService {
  constructor(
    private readonly sql: Sql,
    private readonly audit: Pick<AuditService, 'log'>,
  ) {}

  // --- Kaynak türleri ---
  listTypes() {
    return this.sql.query(
      `SELECT id, code, name, capacity_unit AS "capacityUnit", active FROM resource_types ORDER BY name`,
    );
  }

  async createType(input: { code: string; name: string; capacityUnit?: string }, actor: Actor) {
    const code = input.code.trim().toUpperCase();
    try {
      const [row] = await this.sql.query<{ id: string }>(
        `INSERT INTO resource_types (code, name, capacity_unit) VALUES ($1,$2,$3) RETURNING id`,
        [code, input.name.trim(), input.capacityUnit?.trim() || 'adet'],
      );
      await this.audit.log({ ...actorFields(actor), action: 'resource_type.create', entity: 'resource_type', entityId: row.id, after: { code } });
      return { id: row.id, code };
    } catch (e) {
      throw mapDbError(e);
    }
  }

  // --- Kaynaklar ---
  listResources(opts: { typeCode?: string; includeInactive?: boolean } = {}) {
    const where = ['r.deleted_at IS NULL'];
    const params: unknown[] = [];
    if (opts.typeCode) {
      params.push(opts.typeCode.toUpperCase());
      where.push(`t.code = $${params.length}`);
    }
    if (!opts.includeInactive) where.push('r.active');
    return this.sql.query<ResourceRow>(`${RESOURCE_SELECT} WHERE ${where.join(' AND ')} ORDER BY r.name`, params);
  }

  async getResource(id: string): Promise<ResourceRow> {
    const rows = await this.sql.query<ResourceRow>(`${RESOURCE_SELECT} WHERE r.id = $1 AND r.deleted_at IS NULL`, [id]);
    if (!rows[0]) throw new NotFoundException('Kaynak bulunamadı.');
    return rows[0];
  }

  async createResource(input: CreateResourceInput, actor: Actor): Promise<ResourceRow> {
    const types = await this.sql.query<{ id: string }>(`SELECT id FROM resource_types WHERE code = $1`, [
      input.typeCode.trim().toUpperCase(),
    ]);
    if (!types[0]) throw new BadRequestException('Bilinmeyen kaynak türü.');
    const exclusive = input.exclusive ?? true;
    try {
      const [row] = await this.sql.query<{ id: string }>(
        `INSERT INTO resources (code, name, type_id, capacity, quantity, exclusive, is_demo)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [
          input.code.trim().toUpperCase(),
          input.name.trim(),
          types[0].id,
          input.capacity ?? 1,
          input.quantity ?? 1,
          exclusive,
          input.isDemo ?? false,
        ],
      );
      await this.audit.log({ ...actorFields(actor), action: 'resource.create', entity: 'resource', entityId: row.id, after: input });
      return this.getResource(row.id);
    } catch (e) {
      throw mapDbError(e);
    }
  }

  async updateResource(id: string, input: UpdateResourceInput, actor: Actor): Promise<ResourceRow> {
    const before = await this.getResource(id);
    const sets: string[] = [];
    const params: unknown[] = [];
    const add = (col: string, value: unknown) => {
      params.push(value);
      sets.push(`${col} = $${params.length}`);
    };
    if (input.name !== undefined) add('name', input.name.trim());
    if (input.capacity !== undefined) add('capacity', input.capacity);
    if (input.quantity !== undefined) add('quantity', input.quantity);
    if (input.exclusive !== undefined) add('exclusive', input.exclusive);
    if (input.maintenanceStatus !== undefined) add('maintenance_status', input.maintenanceStatus);
    if (input.active !== undefined) add('active', input.active);
    if (!sets.length) return before;
    params.push(id);
    try {
      await this.sql.query(`UPDATE resources SET ${sets.join(', ')}, updated_at = now() WHERE id = $${params.length}`, params);
    } catch (e) {
      throw mapDbError(e);
    }
    const after = await this.getResource(id);
    await this.audit.log({ ...actorFields(actor), action: 'resource.update', entity: 'resource', entityId: id, before, after });
    return after;
  }

  // --- Bakım / kapatma blokajları ---
  async listBlocks(resourceId: string) {
    await this.getResource(resourceId);
    return this.sql.query(
      `SELECT id, kind, reason, lower(period) AS "from", upper(period) AS "to"
         FROM resource_blocks WHERE resource_id = $1 ORDER BY lower(period)`,
      [resourceId],
    );
  }

  async createBlock(
    resourceId: string,
    input: { from: string; to: string; kind: 'MAINTENANCE' | 'CLOSED'; reason?: string },
    actor: Actor,
  ) {
    await this.getResource(resourceId);
    const p = parsePeriod(input.from, input.to);
    const [row] = await this.sql.query<{ id: string }>(
      `INSERT INTO resource_blocks (resource_id, period, kind, reason)
       VALUES ($1, tstzrange($2::timestamptz, $3::timestamptz, '[)'), $4, $5) RETURNING id`,
      [resourceId, p.from.toISOString(), p.to.toISOString(), input.kind, input.reason?.trim() ?? ''],
    );
    await this.audit.log({ ...actorFields(actor), action: 'resource_block.create', entity: 'resource', entityId: resourceId, after: { blockId: row.id, ...input } });
    return { id: row.id };
  }

  async deleteBlock(resourceId: string, blockId: string, actor: Actor) {
    const rows = await this.sql.query<{ id: string }>(
      `DELETE FROM resource_blocks WHERE id = $1 AND resource_id = $2 RETURNING id`,
      [blockId, resourceId],
    );
    if (!rows[0]) throw new NotFoundException('Blokaj bulunamadı.');
    await this.audit.log({ ...actorFields(actor), action: 'resource_block.delete', entity: 'resource', entityId: resourceId, after: { blockId } });
  }

  // --- Müsaitlik ---
  /**
   * Bir aralıkta kaynağın müsait olup olmadığı. Bilgilendirme amaçlıdır: gerçek garanti rezervasyon anında
   * veritabanı trigger'ıdır. Süresi dolmuş HELD blokajlar sayılmaz.
   */
  async availability(resourceId: string, fromIso: string, toIso: string): Promise<Availability> {
    const r = await this.getResource(resourceId);
    const p = parsePeriod(fromIso, toIso);
    const reasons: Availability['reasons'] = [];
    if (!r.active) reasons.push('INACTIVE');
    if (r.maintenanceStatus !== 'OK') reasons.push('MAINTENANCE');

    const range = `tstzrange($2::timestamptz, $3::timestamptz, '[)')`;
    const args = [resourceId, p.from.toISOString(), p.to.toISOString()];
    const [blocked] = await this.sql.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM resource_blocks WHERE resource_id = $1 AND period && ${range}`,
      args,
    );
    if (blocked.n > 0) reasons.push('BLOCKED');

    const [used] = await this.sql.query<{ used: number }>(
      `SELECT COALESCE(SUM(quantity),0)::int AS used FROM resource_allocations
        WHERE resource_id = $1 AND period && ${range} AND status <> 'RELEASED'
          AND NOT (status = 'HELD' AND hold_expires_at < now())`,
      args,
    );
    const total = r.exclusive ? 1 : r.quantity;
    const remaining = Math.max(0, total - used.used);
    if (remaining === 0) reasons.push(r.exclusive ? 'BOOKED' : 'CAPACITY');
    return {
      resourceId,
      from: p.from.toISOString(),
      to: p.to.toISOString(),
      available: reasons.length === 0,
      remaining: reasons.some((x) => x === 'INACTIVE' || x === 'MAINTENANCE' || x === 'BLOCKED') ? 0 : remaining,
      reasons,
    };
  }
}

function actorFields(a: Actor) {
  return { userId: a.userId, actorLabel: a.label, ip: a.ip };
}

/** PostgreSQL hata kodlarını anlaşılır HTTP hatalarına çevirir (ayrıntı sızdırmadan). */
export function mapDbError(e: unknown): Error {
  const code = (e as { code?: string })?.code;
  if (code === '23505') return new ConflictException('Bu kod zaten kullanılıyor.');
  if (code === '23514' || code === '22P02') return new BadRequestException('Geçersiz değer.');
  return e as Error;
}

/** TypeORM bağlantısını Sql arayüzüne uyarlar. */
@Injectable()
export class TypeOrmSchedulingService extends SchedulingService {
  constructor(@InjectDataSource() ds: DataSource, audit: AuditService) {
    super({ query: (sql, params) => ds.query(sql, params) }, audit);
  }
}
