import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AdminAuthService } from './admin-auth.service.js';
import { hashPassword } from './admin-token.js';

async function setup() {
  const user = {
    username: 'admin',
    passwordHash: await hashPassword('dogru-sifre'),
  };
  const users = {
    findOneBy: vi.fn(async ({ username }: { username: string }) =>
      username === 'admin' ? user : null,
    ),
  };
  const config = {
    getOrThrow: vi.fn(() => 'test-secret-test-secret-test-secret-1234'),
  };
  // @ts-expect-error: yalnızca test için gereken üyeleri taklit eden sahte nesneler
  return new AdminAuthService(users, config);
}

describe('AdminAuthService.login', () => {
  it('doğru bilgilerle belirteç döner', async () => {
    const auth = await setup();
    expect(
      (await auth.login('admin', 'dogru-sifre', '1.1.1.1')).token,
    ).toContain('.');
  });

  it('yanlış şifrede ve bilinmeyen kullanıcıda aynı hatayı verir', async () => {
    const auth = await setup();
    await expect(auth.login('admin', 'yanlis', '1.1.1.1')).rejects.toThrow(
      'Kullanıcı adı veya şifre hatalı.',
    );
    await expect(auth.login('yok', 'x', '1.1.1.1')).rejects.toThrow(
      'Kullanıcı adı veya şifre hatalı.',
    );
  });

  it('5 hatalı denemeden sonra doğru şifreyle bile kilitler', async () => {
    const auth = await setup();
    for (let i = 0; i < 5; i++)
      await expect(
        auth.login('admin', 'yanlis', '2.2.2.2'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(auth.login('admin', 'dogru-sifre', '2.2.2.2')).rejects.toThrow(
      'Çok fazla hatalı deneme',
    );
  });

  it('kilit yalnızca ilgili IP için geçerlidir', async () => {
    const auth = await setup();
    for (let i = 0; i < 5; i++)
      await auth.login('admin', 'yanlis', '3.3.3.3').catch(() => undefined);
    expect(
      (await auth.login('admin', 'dogru-sifre', '4.4.4.4')).token,
    ).toContain('.');
  });
});

describe('AdminAuthService.usesDefaultPassword', () => {
  async function serviceWithPassword(password: string) {
    const user = { username: 'admin', passwordHash: await hashPassword(password) };
    const users = { findOneBy: vi.fn(async () => user) };
    const config = {
      getOrThrow: vi.fn(() => 'test-secret-test-secret-test-secret-1234'),
      get: vi.fn((key: string) => (key === 'ADMIN_PASSWORD' ? 'kurulum-sifresi-77' : undefined)),
    };
    // @ts-expect-error: yalnızca test için gereken üyeleri taklit eden sahte nesneler
    return { service: new AdminAuthService(users, config), users };
  }

  it('yaygın şifreyi ve kurulum şifresini yakalar', async () => {
    expect(await (await serviceWithPassword('123456789')).service.usesDefaultPassword('admin')).toBe(true);
    expect(await (await serviceWithPassword('kurulum-sifresi-77')).service.usesDefaultPassword('admin')).toBe(true);
  });

  it('özgün şifrede false döner ve sonucu önbelleğe alır', async () => {
    const { service } = await serviceWithPassword('cok-ozgun-bir-sifre-4821');
    expect(await service.usesDefaultPassword('admin')).toBe(false);
    expect(await service.usesDefaultPassword('admin')).toBe(false);
  });

  it('kullanıcı yoksa false', async () => {
    const { service, users } = await serviceWithPassword('123456789');
    users.findOneBy.mockResolvedValueOnce(null as never);
    expect(await service.usesDefaultPassword('yok')).toBe(false);
  });
});
