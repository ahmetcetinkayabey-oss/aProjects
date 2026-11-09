import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { hashPassword, verifyPassword } from '../admin/admin-token.js';
import { RateLimiter } from '../common/rate-limit.guard.js';
import { isProductionDatabase } from '../common/database-driver.js';
import { AuditService } from './audit.service.js';
import { Permission } from './permission.entity.js';
import { PERMISSION_CODES, ROLE_DEFS } from './rbac-seed.js';
import { Role } from './role.entity.js';
import { createUserToken } from './user-token.js';
import { User, UserStatus } from './user.entity.js';

/** İstek sahibi: kullanıcı ya da (geçiş döneminde) eski tek yönetici hesabı. */
export interface Principal {
  kind: 'admin' | 'user';
  userId?: string;
  label: string;
  /** Eski yönetici hesabı sistem yöneticisi gibi davranır. */
  all: boolean;
  permissions: Set<string>;
  userType?: User['userType'];
}

export interface Actor {
  userId?: string | null;
  label: string;
  ip?: string | null;
}

const LOGIN_ERROR = 'E-posta veya şifre hatalı.';

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

@Injectable()
export class IdentityService implements OnModuleInit {
  private readonly logger = new Logger(IdentityService.name);
  /** Aynı IP+e-posta için 15 dakikada en fazla 8 deneme (bellek içi; tek sunucu). */
  private readonly loginLimiter = new RateLimiter(8, 15 * 60 * 1000);
  private dummyHash?: Promise<string>;

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(Permission) private readonly permissions: Repository<Permission>,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  private get secret(): string {
    return this.config.getOrThrow<string>('ADMIN_TOKEN_SECRET');
  }

  /** Geliştirmede (SQLite) rol/izin tanımları migration olmadığı için koddan eklenir. */
  async onModuleInit(): Promise<void> {
    if (isProductionDatabase) return;
    if ((await this.roles.count()) > 0) return;
    const perms = await this.permissions.save(
      PERMISSION_CODES.map(([code, description]) => ({ code, description })),
    );
    const byCode = new Map(perms.map((p) => [p.code, p]));
    for (const def of ROLE_DEFS) {
      const granted =
        def.permissions === 'ALL' ? perms : def.permissions.map((c) => byCode.get(c)!);
      await this.roles.save(
        this.roles.create({ code: def.code, name: def.name, scope: def.scope, permissions: granted }),
      );
    }
    this.logger.log('Sistem rolleri ve izinleri oluşturuldu (geliştirme).');
  }

  async login(email: string, password: string, ip: string): Promise<{ token: string }> {
    const mail = normalizeEmail(email);
    if (!this.loginLimiter.take(`${ip}|${mail}`)) {
      throw new UnauthorizedException('Çok fazla deneme. 15 dakika sonra tekrar deneyin.');
    }
    const user = await this.users.findOne({
      where: { email: mail },
      select: { id: true, passwordHash: true, status: true, tokenVersion: true, email: true },
    });
    // Kullanıcı yoksa da aynı sürede parola doğrulaması yapılır (zamanlama farkı hesap sızdırmasın).
    const hash = user?.passwordHash ?? (await this.getDummyHash());
    const valid = await verifyPassword(password, hash);
    if (!user || !user.passwordHash || !valid || user.status !== 'ACTIVE') {
      await this.audit.log({ action: 'auth.login_failed', entity: 'user', actorLabel: mail, ip });
      throw new UnauthorizedException(LOGIN_ERROR);
    }
    await this.users.update(user.id, { lastLoginAt: new Date() });
    await this.audit.log({ userId: user.id, actorLabel: user.email, action: 'auth.login', entity: 'user', entityId: user.id, ip });
    return { token: createUserToken({ sub: user.id, tv: user.tokenVersion }, this.secret) };
  }

  /** Belirteçten gelen kullanıcıyı doğrular; geçersizse null. İzinler her istekte veritabanından okunur. */
  async principalFor(userId: string, tokenVersion: number): Promise<Principal | null> {
    const user = await this.users.findOne({
      where: { id: userId },
      relations: { roles: { permissions: true } },
    });
    if (!user || user.status !== 'ACTIVE' || user.tokenVersion !== tokenVersion) return null;
    const permissions = new Set<string>();
    for (const role of user.roles) for (const p of role.permissions) permissions.add(p.code);
    return { kind: 'user', userId: user.id, label: user.email, all: false, permissions, userType: user.userType };
  }

  async me(userId: string) {
    const user = await this.users.findOne({ where: { id: userId }, relations: { roles: true } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı.');
    return this.publicUser(user);
  }

  async changePassword(userId: string, current: string, next: string, ip: string): Promise<void> {
    const user = await this.users.findOne({
      where: { id: userId },
      select: { id: true, email: true, passwordHash: true, tokenVersion: true },
    });
    if (!user?.passwordHash || !(await verifyPassword(current, user.passwordHash))) {
      throw new UnauthorizedException('Mevcut şifre hatalı.');
    }
    await this.users.update(user.id, {
      passwordHash: await hashPassword(next),
      tokenVersion: user.tokenVersion + 1,
    });
    await this.audit.log({ userId: user.id, actorLabel: user.email, action: 'auth.password_change', entity: 'user', entityId: user.id, ip });
  }

  async listUsers(page: number, pageSize: number, q?: string) {
    const qb = this.users
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.roles', 'r')
      .orderBy('u.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
    if (q) qb.andWhere('(lower(u.email) LIKE :q OR lower(u.fullName) LIKE :q)', { q: `%${q.toLowerCase()}%` });
    const [items, total] = await qb.getManyAndCount();
    return { items: items.map((u) => this.publicUser(u)), total, page, pageSize };
  }

  /** Şimdilik yalnızca personel hesabı açılır; B2C/B2B kayıt akışları ilgili fazlarda eklenir. */
  async createPersonnel(
    dto: { email: string; fullName: string; phone?: string; password: string; roleCodes: string[] },
    actor: Actor,
  ) {
    const email = normalizeEmail(dto.email);
    if (await this.users.findOne({ where: { email }, withDeleted: true })) {
      throw new ConflictException('Bu e-posta ile bir hesap zaten var.');
    }
    const roles = await this.resolvePersonnelRoles(dto.roleCodes);
    const saved = await this.users.save(
      this.users.create({
        email,
        fullName: dto.fullName.trim(),
        phone: dto.phone?.trim() || null,
        userType: 'PERSONNEL',
        status: 'ACTIVE',
        passwordHash: await hashPassword(dto.password),
        roles,
      }),
    );
    await this.audit.log({
      userId: actor.userId, actorLabel: actor.label, ip: actor.ip,
      action: 'user.create', entity: 'user', entityId: saved.id,
      after: { email, roles: roles.map((r) => r.code) },
    });
    return this.publicUser(saved);
  }

  async setRoles(userId: string, roleCodes: string[], actor: Actor) {
    const user = await this.users.findOne({ where: { id: userId }, relations: { roles: true } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı.');
    if (user.userType !== 'PERSONNEL') {
      throw new BadRequestException('Bu uçtan yalnızca personel rolleri değiştirilebilir.');
    }
    const before = user.roles.map((r) => r.code);
    user.roles = await this.resolvePersonnelRoles(roleCodes);
    await this.users.save(user);
    // Yetki değişince açık oturumlar yenilensin.
    await this.users.update(user.id, { tokenVersion: user.tokenVersion + 1 });
    await this.audit.log({
      userId: actor.userId, actorLabel: actor.label, ip: actor.ip,
      action: 'user.roles_change', entity: 'user', entityId: user.id,
      before: { roles: before }, after: { roles: user.roles.map((r) => r.code) },
    });
    return this.publicUser(user);
  }

  async setStatus(userId: string, status: Extract<UserStatus, 'ACTIVE' | 'DISABLED'>, actor: Actor) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı.');
    if (actor.userId && actor.userId === user.id && status === 'DISABLED') {
      throw new BadRequestException('Kendi hesabınızı kapatamazsınız.');
    }
    const before = user.status;
    // Kapatma açık oturumları da geçersiz kılar.
    await this.users.update(user.id, { status, tokenVersion: user.tokenVersion + 1 });
    await this.audit.log({
      userId: actor.userId, actorLabel: actor.label, ip: actor.ip,
      action: 'user.status_change', entity: 'user', entityId: user.id,
      before: { status: before }, after: { status },
    });
    return { id: user.id, status };
  }

  private async resolvePersonnelRoles(codes: string[]): Promise<Role[]> {
    const unique = [...new Set(codes)];
    const roles = await this.roles.find({ where: { code: In(unique) } });
    const missing = unique.filter((c) => !roles.some((r) => r.code === c));
    if (missing.length || roles.length === 0) {
      throw new BadRequestException(`Geçersiz rol: ${missing.join(', ') || 'boş liste'}`);
    }
    const wrongScope = roles.filter((r) => r.scope !== 'PERSONNEL');
    if (wrongScope.length) {
      throw new BadRequestException(`Personel hesabına atanamayan rol: ${wrongScope.map((r) => r.code).join(', ')}`);
    }
    return roles;
  }

  private publicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone ?? null,
      userType: user.userType,
      status: user.status,
      roles: (user.roles ?? []).map((r) => r.code),
      lastLoginAt: user.lastLoginAt ?? null,
      createdAt: user.createdAt,
    };
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= hashPassword('dummy-password-for-timing');
    return this.dummyHash;
  }
}
