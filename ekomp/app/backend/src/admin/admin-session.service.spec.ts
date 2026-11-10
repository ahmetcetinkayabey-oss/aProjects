import { describe, expect, it, vi } from 'vitest';
import { AdminSessionService } from './admin-session.service.js';
import { TOKEN_TTL_MS, issuedAt } from './admin-token.js';

function service(user: { username: string; passwordChangedAt?: Date | null } | null) {
  const users = { findOneBy: vi.fn(async () => user) };
  // @ts-expect-error: yalnızca test için gereken üyeleri taklit eden sahte nesne
  return new AdminSessionService(users);
}

/** exp = verilme anı + süre; verilme anını istediğimiz gibi kurmak için. */
const expFor = (issued: number) => issued + TOKEN_TTL_MS;

describe('AdminSessionService.isCurrent', () => {
  it('parola hiç değişmediyse oturum geçerli', async () => {
    expect(await service({ username: 'admin' }).isCurrent('admin', expFor(Date.now()))).toBe(true);
  });

  it('parola değişiminden ÖNCE verilmiş oturum geçersiz, SONRA verilen geçerli', async () => {
    const changed = Date.now() - 60_000;
    const s = service({ username: 'admin', passwordChangedAt: new Date(changed) });
    expect(await s.isCurrent('admin', expFor(changed - 1000))).toBe(false);
    expect(await s.isCurrent('admin', expFor(changed + 1000))).toBe(true);
  });

  it('hesap yoksa geçersiz', async () => {
    expect(await service(null).isCurrent('yok', expFor(Date.now()))).toBe(false);
  });

  it('issuedAt, exp − süre olarak hesaplanır', () => {
    expect(issuedAt(5_000_000_000)).toBe(5_000_000_000 - TOKEN_TTL_MS);
  });
});
