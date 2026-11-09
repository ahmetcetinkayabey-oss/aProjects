import { createHmac, timingSafeEqual } from 'node:crypto';

const TTL_MS = 12 * 60 * 60 * 1000;

/**
 * Kullanıcı (personel/B2C/B2B) oturum belirteci. Yönetici ve forum belirteçlerinden FARKLI bir anahtarla
 * imzalanır: üç belirteç türü birbirinin yerine geçemez. `tv` (token_version) hesap kapatma/parola
 * değişiminde artar, böylece eski belirteçler sunucu tarafında geçersiz kılınabilir.
 */
function key(secret: string): string {
  return `${secret}:user-session`;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', key(secret)).update(payload).digest('base64url');
}

export interface UserTokenPayload {
  sub: string;
  tv: number;
}

export function createUserToken(
  payload: UserTokenPayload,
  secret: string,
  now = Date.now(),
): string {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: now + TTL_MS }),
  ).toString('base64url');
  return `${body}.${sign(body, secret)}`;
}

export function verifyUserToken(
  token: string,
  secret: string,
  now = Date.now(),
): UserTokenPayload | null {
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as {
      sub?: unknown;
      tv?: unknown;
      exp?: unknown;
    };
    if (typeof data.sub !== 'string' || typeof data.tv !== 'number') return null;
    if (typeof data.exp !== 'number' || data.exp <= now) return null;
    return { sub: data.sub, tv: data.tv };
  } catch {
    return null;
  }
}
