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
