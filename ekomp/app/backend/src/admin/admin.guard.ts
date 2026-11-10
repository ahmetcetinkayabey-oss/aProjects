import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AdminSessionService } from './admin-session.service.js';
import { verifyToken } from './admin-token.js';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly sessions: AdminSessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { adminUser?: string }>();
    const header = request.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const secret = this.config.getOrThrow<string>('ADMIN_TOKEN_SECRET');
    const payload = token ? verifyToken(token, secret) : null;
    if (!payload || !(await this.sessions.isCurrent(payload.sub, payload.exp))) {
      throw new UnauthorizedException('Oturum geçersiz veya süresi dolmuş.');
    }
    request.adminUser = payload.sub;
    return true;
  }
}
