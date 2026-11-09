import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity.js';

export interface AuditEntry {
  userId?: string | null;
  actorLabel?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
  ip?: string | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog) private readonly logs: Repository<AuditLog>,
  ) {}

  /**
   * Kritik işlemi kaydeder. Kayıt yazılamazsa işlem yine de hata verir:
   * denetim izi olmadan kritik işlem sessizce geçmemelidir.
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await this.logs.save(
        this.logs.create({
        userId: entry.userId ?? null,
        actorLabel: entry.actorLabel ?? null,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        before: entry.before ?? null,
        after: entry.after ?? null,
        ip: entry.ip ?? null,
        }),
      );
    } catch (error) {
      this.logger.error(`Audit kaydı yazılamadı: ${entry.action}`, error as Error);
      throw error;
    }
  }

  async list(filter: {
    entity?: string;
    entityId?: string;
    page: number;
    pageSize: number;
  }): Promise<{ items: AuditLog[]; total: number; page: number; pageSize: number }> {
    const where: Record<string, string> = {};
    if (filter.entity) where.entity = filter.entity;
    if (filter.entityId) where.entityId = filter.entityId;
    const [items, total] = await this.logs.findAndCount({
      where,
      order: { at: 'DESC', id: 'DESC' },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
    });
    return { items, total, page: filter.page, pageSize: filter.pageSize };
  }
}
