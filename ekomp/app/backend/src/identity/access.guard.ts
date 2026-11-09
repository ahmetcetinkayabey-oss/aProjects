import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { verifyToken } from '../admin/admin-token.js';
import { IdentityService, Principal } from './identity.service.js';
import type { PermissionCode } from './rbac-seed.js';
import { verifyUserToken } from './user-token.js';

const PERMISSIONS_KEY = 'required_permissions';

/** Uç için gereken izinler (hepsi gerekir). Boş bırakılırsa yalnızca geçerli oturum yeterlidir. */
export const RequirePermission = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export type PrincipalRequest = Request & { principal: Principal };

/**
 * Kimlik + izin kontrolü (sunucu tarafı). İki oturum türünü kabul eder:
 * 1) kullanıcı belirteci → durum, token_version ve rol izinleri her istekte veritabanından doğrulanır;
 * 2) eski yönetici belirteci → geçiş döneminde sistem yöneticisi sayılır.
 */
@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly identity: IdentityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PrincipalRequest>();
    const header = request.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) throw new UnauthorizedException('Oturum geçersiz veya süresi dolmuş.');

    const secret = this.config.getOrThrow<string>('ADMIN_TOKEN_SECRET');
    let principal: Principal | null = null;
    const userPayload = verifyUserToken(token, secret);
    if (userPayload) {
      principal = await this.identity.principalFor(userPayload.sub, userPayload.tv);
    } else {
      const admin = verifyToken(token, secret);
      if (admin) {
        principal = { kind: 'admin', label: admin.sub, all: true, permissions: new Set() };
      }
    }
    if (!principal) throw new UnauthorizedException('Oturum geçersiz veya süresi dolmuş.');

    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [];
    if (!principal.all && !required.every((p) => principal.permissions.has(p))) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok.');
    }
    request.principal = principal;
    return true;
  }
}
