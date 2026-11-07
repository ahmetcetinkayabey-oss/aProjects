import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteContent } from './site-content.entity.js';
import { UpsertContentDto } from './content.dto.js';

export type ContentMap = Record<string, { tr: string; en: string | null }>;

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(SiteContent) private readonly repo: Repository<SiteContent>,
  ) {}

  /** Anahtar -> { tr, en } sözlüğü (site bu haritayı varsayılan metinlerin üstüne uygular). */
  async asMap(): Promise<ContentMap> {
    const rows = await this.repo.find();
    return Object.fromEntries(rows.map((r) => [r.key, { tr: r.tr, en: r.en ?? null }]));
  }

  async upsert(key: string, dto: UpsertContentDto): Promise<SiteContent> {
    const tr = dto.tr.trim();
    const en = dto.en?.trim() ? dto.en.trim() : null;
    return this.repo.save({ key, tr, en });
  }

  /** Kaydı siler: site koddaki varsayılan metne döner. */
  async reset(key: string): Promise<void> {
    const result = await this.repo.delete(key);
    if (!result.affected) throw new NotFoundException('Bu metin zaten varsayılan.');
  }
}
