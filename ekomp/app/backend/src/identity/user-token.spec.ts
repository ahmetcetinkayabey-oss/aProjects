import { describe, expect, it } from 'vitest';
import { createToken, verifyToken } from '../admin/admin-token.js';
import { createUserToken, verifyUserToken } from './user-token.js';

const SECRET = 'test-secret-test-secret-test-secret-1234';

describe('kullanıcı belirteci', () => {
  it('imzalı belirteç doğrulanır ve kimlik/sürüm geri gelir', () => {
    const t = createUserToken({ sub: 'u1', tv: 3 }, SECRET);
    expect(verifyUserToken(t, SECRET)).toEqual({ sub: 'u1', tv: 3 });
  });

  it('değiştirilmiş yük ya da yanlış anahtar reddedilir', () => {
    const t = createUserToken({ sub: 'u1', tv: 0 }, SECRET);
    const [body, sig] = t.split('.');
    const forged = Buffer.from(JSON.stringify({ sub: 'admin', tv: 0, exp: Date.now() + 1e9 })).toString('base64url');
    expect(verifyUserToken(`${forged}.${sig}`, SECRET)).toBeNull();
    expect(verifyUserToken(`${body}.x`, SECRET)).toBeNull();
    expect(verifyUserToken(t, SECRET + 'x')).toBeNull();
    expect(verifyUserToken('', SECRET)).toBeNull();
  });

  it('süresi dolan belirteç reddedilir', () => {
    const t = createUserToken({ sub: 'u1', tv: 0 }, SECRET, Date.now() - 13 * 60 * 60 * 1000);
    expect(verifyUserToken(t, SECRET)).toBeNull();
  });

  it('yönetici belirteci kullanıcı belirteci yerine geçemez ve tersi', () => {
    const admin = createToken('admin', SECRET);
    const user = createUserToken({ sub: 'u1', tv: 0 }, SECRET);
    expect(verifyUserToken(admin, SECRET)).toBeNull();
    expect(verifyToken(user, SECRET)).toBeNull();
  });
});
