import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { CreateNewsDto } from './news.dto.js';

const valid = {
  slug: 'ornek-haber',
  title: 'Örnek haber',
  summary: 'Kısa özet',
  publishedAt: '2026-06-13',
};

async function errorsOf(input: Record<string, unknown>): Promise<string[]> {
  return (await validate(plainToInstance(CreateNewsDto, input))).map(
    (e) => e.property,
  );
}

describe('CreateNewsDto', () => {
  it('basın haberi alanları olmadan da geçerlidir', async () => {
    expect(await errorsOf(valid)).toEqual([]);
  });

  it('https kaynak bağlantısını kabul eder', async () => {
    expect(
      await errorsOf({
        ...valid,
        sourceUrl: 'https://www.aa.com.tr/tr/haber/1',
        sourceName: 'AA',
        category: 'KAMP',
      }),
    ).toEqual([]);
  });

  it('http/https dışındaki bağlantıları reddeder (javascript: gibi)', async () => {
    expect(
      await errorsOf({ ...valid, sourceUrl: 'javascript:alert(1)' }),
    ).toEqual(['sourceUrl']);
    expect(
      await errorsOf({ ...valid, sourceUrl: 'ftp://example.com/x' }),
    ).toEqual(['sourceUrl']);
    expect(await errorsOf({ ...valid, sourceUrl: 'adres-degil' })).toEqual([
      'sourceUrl',
    ]);
  });

  it('geçersiz slug ve tarihi reddeder', async () => {
    expect(
      (
        await errorsOf({ ...valid, slug: 'Büyük Harf', publishedAt: 'dun' })
      ).sort(),
    ).toEqual(['publishedAt', 'slug']);
  });
});
