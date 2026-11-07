import { NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { describe, expect, it } from 'vitest';
import { ContentService } from './content.service.js';
import type { SiteContent } from './site-content.entity.js';

/** TypeORM deposu yerine bellekte çalışan sahte depo. */
function fakeRepo() {
  const rows = new Map<string, SiteContent>();
  const repo = {
    find: () => Promise.resolve([...rows.values()]),
    save: (row: SiteContent) => {
      rows.set(row.key, row);
      return Promise.resolve(row);
    },
    delete: (key: string) => Promise.resolve({ affected: rows.delete(key) ? 1 : 0 }),
  };
  return repo as unknown as Repository<SiteContent>;
}

describe('ContentService', () => {
  it('metni kırpar, boş İngilizceyi null yapar ve haritada döndürür', async () => {
    const service = new ContentService(fakeRepo());
    await service.upsert('home.hero.title2', { tr: '  evi  ', en: '   ' });
    await service.upsert('footer.cta', { tr: 'Talep', en: ' Request ' });
    expect(await service.asMap()).toEqual({
      'home.hero.title2': { tr: 'evi', en: null },
      'footer.cta': { tr: 'Talep', en: 'Request' },
    });
  });

  it('aynı anahtarı tekrar kaydedince üzerine yazar', async () => {
    const service = new ContentService(fakeRepo());
    await service.upsert('k', { tr: 'bir' });
    await service.upsert('k', { tr: 'iki' });
    expect(await service.asMap()).toEqual({ k: { tr: 'iki', en: null } });
  });

  it('sıfırlama kaydı siler; olmayan kayıtta 404 verir', async () => {
    const service = new ContentService(fakeRepo());
    await service.upsert('k', { tr: 'x' });
    await expect(service.reset('k')).resolves.toBeUndefined();
    await expect(service.reset('k')).rejects.toBeInstanceOf(NotFoundException);
  });
});
