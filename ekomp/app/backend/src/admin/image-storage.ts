import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BadGatewayException } from '@nestjs/common';

export const UPLOAD_DIR = join(process.cwd(), 'uploads');

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

/** Dosya içeriğinin gerçekten JPG/PNG/WebP olup olmadığını imzasından doğrular. */
export function hasImageSignature(buf: Buffer): boolean {
  const head = buf.subarray(0, 12);
  const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const isPng = head
    .subarray(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp =
    head.subarray(0, 4).toString('latin1') === 'RIFF' &&
    head.subarray(8, 12).toString('latin1') === 'WEBP';
  return isJpeg || isPng || isWebp;
}

/**
 * Görseli saklar ve herkese açık adresini döndürür.
 * SUPABASE_URL + SUPABASE_SERVICE_KEY tanımlıysa Supabase Storage'a (kalıcı, yayın için),
 * değilse yerel `uploads/` klasörüne (geliştirme) yazar.
 */
export async function storeImage(
  buf: Buffer,
  mimetype: string,
): Promise<string> {
  const name = `${randomBytes(12).toString('hex')}${ALLOWED_IMAGE_TYPES[mimetype] ?? ''}`;
  const base = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (base && key) {
    const bucket = process.env.SUPABASE_BUCKET ?? 'uploads';
    const res = await fetch(`${base}/storage/v1/object/${bucket}/${name}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': mimetype,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: new Uint8Array(buf),
    });
    if (!res.ok) {
      throw new BadGatewayException('Görsel depolamaya yüklenemedi.');
    }
    return `${base}/storage/v1/object/public/${bucket}/${name}`;
  }
  mkdirSync(UPLOAD_DIR, { recursive: true });
  writeFileSync(join(UPLOAD_DIR, name), buf);
  return `/uploads/${name}`;
}
