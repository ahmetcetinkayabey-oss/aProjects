import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateFacilityDto } from './facility.dto.js';
import { CreateNewsDto, UpdateNewsDto } from '../news/news.dto.js';

const news = {
  slug: 'ornek',
  title: 'Örnek',
  summary: 'Özet',
  publishedAt: '2026-06-13',
};
const facility = {
  slug: 'ornek',
  category: 'Spor',
  icon: 'pool',
  title: 'Örnek',
  description: 'Açıklama',
  badge: 'Yeni',
  footerLeft: 'a',
  footerRight: 'b',
};

async function errs(cls: new () => object, input: object): Promise<string[]> {
  return (await validate(plainToInstance(cls, input))).map((e) => e.property);
}

describe('İngilizce alanlar', () => {
  it('haber: İngilizce alanlar isteğe bağlıdır ve kabul edilir', async () => {
    expect(await errs(CreateNewsDto, news)).toEqual([]);
    expect(
      await errs(UpdateNewsDto, {
        titleEn: 'T',
        summaryEn: null,
        contentEn: 'C',
      }),
    ).toEqual([]);
  });

  it('haber: string olmayan veya aşırı uzun değeri reddeder', async () => {
    expect(await errs(CreateNewsDto, { ...news, titleEn: 5 })).toEqual([
      'titleEn',
    ]);
    expect(
      await errs(CreateNewsDto, { ...news, categoryEn: 'x'.repeat(101) }),
    ).toEqual(['categoryEn']);
  });

  it('tesis: İngilizce alanlar ve statsEn kabul edilir', async () => {
    expect(
      await errs(CreateFacilityDto, {
        ...facility,
        titleEn: 'Pool',
        statsEn: [{ label: 'Depth', value: '2 m' }],
      }),
    ).toEqual([]);
  });

  it('tesis: hatalı statsEn satırını reddeder', async () => {
    expect(
      await errs(CreateFacilityDto, { ...facility, statsEn: [{ label: 1 }] }),
    ).toEqual(['statsEn']);
  });
});
