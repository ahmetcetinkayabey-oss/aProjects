import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createToken,
  hashPassword,
  verifyPassword,
  verifyToken,
} from './admin-token.js';

const SECRET = 'test-secret-test-secret-test-secret-1234';

afterEach(() => vi.useRealTimers());

describe('oturum belirteci', () => {
  it('geçerli belirteci kullanıcı adıyla doğrular', () => {
    expect(verifyToken(createToken('admin', SECRET), SECRET)).toEqual({
      sub: 'admin',
    });
  });

  it('yanlış anahtarla üretilmiş belirteci reddeder', () => {
    expect(
      verifyToken(
        createToken('admin', 'baska-bir-anahtar-baska-bir-anahtar'),
        SECRET,
      ),
    ).toBeNull();
  });

  it('içeriği değiştirilmiş belirteci reddeder', () => {
    const [, signature] = createToken('admin', SECRET).split('.');
    const forged = Buffer.from(
      JSON.stringify({ sub: 'root', exp: Date.now() + 100000 }),
    ).toString('base64url');
    expect(verifyToken(`${forged}.${signature}`, SECRET)).toBeNull();
  });

  it('süresi dolmuş belirteci reddeder', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const token = createToken('admin', SECRET);
    vi.setSystemTime(new Date('2026-01-02T00:00:00Z')); // 24 saat sonra (ömür 12 saat)
    expect(verifyToken(token, SECRET)).toBeNull();
  });

  it('bozuk girdilerde hata fırlatmaz', () => {
    expect(verifyToken('', SECRET)).toBeNull();
    expect(verifyToken('abc', SECRET)).toBeNull();
    expect(verifyToken('a.b', SECRET)).toBeNull();
  });
});

describe('şifre özeti', () => {
  it('doğru şifreyi doğrular, yanlışı reddeder', async () => {
    const hash = await hashPassword('Gizli-Sifre-1');
    expect(await verifyPassword('Gizli-Sifre-1', hash)).toBe(true);
    expect(await verifyPassword('yanlis', hash)).toBe(false);
  });

  it('aynı şifre için her seferinde farklı özet üretir (tuzlama)', async () => {
    expect(await hashPassword('ayni')).not.toBe(await hashPassword('ayni'));
  });
});
