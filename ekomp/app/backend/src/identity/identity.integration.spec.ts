import 'reflect-metadata';
import {
  BadRequestException,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createToken } from '../admin/admin-token.js';
import { AccessGuard, RequirePermission } from './access.guard.js';
import { AuditLog } from './audit-log.entity.js';
import { AuditService } from './audit.service.js';
import { IdentityService } from './identity.service.js';
import { Permission } from './permission.entity.js';
import { Role } from './role.entity.js';
import { createUserToken, verifyUserToken } from './user-token.js';
import { User } from './user.entity.js';

const SECRET = 'test-secret-test-secret-test-secret-1234';
const config = { getOrThrow: () => SECRET } as never;
const PASSWORD = 'uzun-ve-guvenli-sifre';

let ds: DataSource;
let identity: IdentityService;
let audit: AuditService;
let guard: AccessGuard;

class Probe {
  @RequirePermission('booking:approve')
  approve() {}
  @RequirePermission()
  anyone() {}
}

function ctx(handler: () => void, token?: string): ExecutionContext {
  const req = { headers: token ? { authorization: `Bearer ${token}` } : {} };
  return {
    getHandler: () => handler,
    getClass: () => Probe,
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

const actor = { userId: null, label: 'test', ip: '1.1.1.1' };

async function newUser(email: string, roleCodes: string[]) {
  const u = await identity.createPersonnel(
    { email, fullName: 'Test Kişi', password: PASSWORD, roleCodes },
    actor,
  );
  return u;
}

async function tokenFor(id: string): Promise<string> {
  const row = await ds.getRepository(User).findOneByOrFail({ id });
  return createUserToken({ sub: id, tv: row.tokenVersion }, SECRET);
}

beforeAll(async () => {
  ds = new DataSource({
    type: 'better-sqlite3',
    database: ':memory:',
    entities: [User, Role, Permission, AuditLog],
    synchronize: true,
  });
  await ds.initialize();
  audit = new AuditService(ds.getRepository(AuditLog));
  identity = new IdentityService(
    ds.getRepository(User),
    ds.getRepository(Role),
    ds.getRepository(Permission),
    config,
    audit,
  );
  await identity.onModuleInit();
  guard = new AccessGuard(new Reflector(), config, identity, { isCurrent: async () => true } as never);
});

afterAll(async () => {
  await ds.destroy();
});

describe('roller ve hesap açma', () => {
  it('10 sistem rolü oluşur', async () => {
    expect(await ds.getRepository(Role).count()).toBe(10);
  });

  it('e-posta büyük/küçük harfe duyarsız tekil; B2B rolü personele verilemez', async () => {
    await newUser('Ayse@Test.com', ['RESERVATION_OFFICER']);
    await expect(newUser('ayse@test.COM', ['RESERVATION_OFFICER'])).rejects.toBeInstanceOf(ConflictException);
    await expect(newUser('b2b@test.com', ['B2B_ORG_ADMIN'])).rejects.toBeInstanceOf(BadRequestException);
    await expect(newUser('yok@test.com', ['YOK_ROL'])).rejects.toBeInstanceOf(BadRequestException);
  });

  it('parola düz metin saklanmaz ve yanıtta/audit kaydında görünmez', async () => {
    const u = await newUser('gizli@test.com', ['OPERATIONS_STAFF']);
    expect(JSON.stringify(u)).not.toContain(PASSWORD);
    const raw = await ds.getRepository(User).findOne({ where: { id: u.id }, select: { id: true, passwordHash: true } });
    expect(raw?.passwordHash).toBeTruthy();
    expect(raw?.passwordHash).not.toContain(PASSWORD);
    const logs = await audit.list({ entity: 'user', entityId: u.id, page: 1, pageSize: 10 });
    expect(JSON.stringify(logs.items)).not.toContain(PASSWORD);
    expect(logs.items.map((l) => l.action)).toContain('user.create');
  });
});

describe('giriş', () => {
  it('doğru bilgiyle belirteç döner; yanlış parola ve bilinmeyen e-posta aynı hatayı verir', async () => {
    await newUser('giris@test.com', ['OPERATIONS_STAFF']);
    const ok = await identity.login('GIRIS@test.com', PASSWORD, '2.2.2.2');
    expect(verifyUserToken(ok.token, SECRET)).not.toBeNull();
    const wrong = await identity.login('giris@test.com', 'yanlis', '2.2.2.3').catch((e: Error) => e);
    const unknown = await identity.login('yok@test.com', 'yanlis', '2.2.2.4').catch((e: Error) => e);
    expect(wrong).toBeInstanceOf(UnauthorizedException);
    expect((wrong as Error).message).toBe((unknown as Error).message);
  });

  it('kapatılmış hesap giriş yapamaz; başarısız girişler audit’e yazılır', async () => {
    const u = await newUser('kapali@test.com', ['OPERATIONS_STAFF']);
    await identity.setStatus(u.id, 'DISABLED', actor);
    await expect(identity.login('kapali@test.com', PASSWORD, '3.3.3.3')).rejects.toBeInstanceOf(UnauthorizedException);
    const logs = await audit.list({ entity: 'user', page: 1, pageSize: 100 });
    expect(logs.items.some((l) => l.action === 'auth.login_failed' && l.actorLabel === 'kapali@test.com')).toBe(true);
  });

  it('aynı IP+e-posta için 8 denemeden sonra engellenir', async () => {
    await newUser('limit@test.com', ['OPERATIONS_STAFF']);
    for (let i = 0; i < 8; i++) {
      await identity.login('limit@test.com', 'yanlis', '9.9.9.9').catch(() => undefined);
    }
    await expect(identity.login('limit@test.com', PASSWORD, '9.9.9.9')).rejects.toThrow(/Çok fazla deneme/);
  });
});

describe('oturum geçersiz kılma (token_version)', () => {
  it('hesap kapatılınca eski belirteç artık kabul edilmez', async () => {
    const u = await newUser('kapat@test.com', ['RESERVATION_OFFICER']);
    const t = await tokenFor(u.id);
    expect(await guard.canActivate(ctx(Probe.prototype.approve, t))).toBe(true);
    await identity.setStatus(u.id, 'DISABLED', actor);
    await expect(guard.canActivate(ctx(Probe.prototype.approve, t))).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('parola değişince eski belirteç geçersiz, yeni girişle yenisi alınır', async () => {
    const u = await newUser('sifre@test.com', ['RESERVATION_OFFICER']);
    const old = await tokenFor(u.id);
    await identity.changePassword(u.id, PASSWORD, 'yepyeni-sifre-123', '4.4.4.4');
    await expect(guard.canActivate(ctx(Probe.prototype.anyone, old))).rejects.toBeInstanceOf(UnauthorizedException);
    const fresh = await identity.login('sifre@test.com', 'yepyeni-sifre-123', '4.4.4.5');
    expect(await guard.canActivate(ctx(Probe.prototype.anyone, fresh.token))).toBe(true);
  });

  it('rol değişince eski belirteç yenilenmeye zorlanır', async () => {
    const u = await newUser('rol@test.com', ['OPERATIONS_STAFF']);
    const old = await tokenFor(u.id);
    await identity.setRoles(u.id, ['RESERVATION_OFFICER'], actor);
    await expect(guard.canActivate(ctx(Probe.prototype.anyone, old))).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('kullanıcı kendi hesabını kapatamaz', async () => {
    const u = await newUser('kendi@test.com', ['FACILITY_MANAGER']);
    await expect(identity.setStatus(u.id, 'DISABLED', { ...actor, userId: u.id })).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('AccessGuard (sunucu tarafı yetki)', () => {
  it('belirteç yoksa 401', async () => {
    await expect(guard.canActivate(ctx(Probe.prototype.approve))).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('izin yoksa 403, izin varsa geçer', async () => {
    const ops = await newUser('ops@test.com', ['OPERATIONS_STAFF']);
    const officer = await newUser('officer@test.com', ['RESERVATION_OFFICER']);
    await expect(guard.canActivate(ctx(Probe.prototype.approve, await tokenFor(ops.id)))).rejects.toBeInstanceOf(ForbiddenException);
    expect(await guard.canActivate(ctx(Probe.prototype.approve, await tokenFor(officer.id)))).toBe(true);
  });

  it('eski yönetici belirteci sistem yöneticisi sayılır; başka anahtarla imzalı reddedilir', async () => {
    expect(await guard.canActivate(ctx(Probe.prototype.approve, createToken('admin', SECRET)))).toBe(true);
    await expect(
      guard.canActivate(ctx(Probe.prototype.approve, createToken('admin', 'baska-anahtar-baska-anahtar-1234567'))),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('sahte (başka kullanıcı adına üretilmiş) belirteç reddedilir', async () => {
    const forged = createUserToken({ sub: 'olmayan-kullanici', tv: 0 }, SECRET);
    await expect(guard.canActivate(ctx(Probe.prototype.anyone, forged))).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
