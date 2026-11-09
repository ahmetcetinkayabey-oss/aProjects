import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { verifyToken } from './admin-token.js';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { adminUser?: string }>();
    const header = request.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const secret = this.config.getOrThrow<string>('ADMIN_TOKEN_SECRET');
    const payload = token ? verifyToken(token, secret) : null;
    if (!payload) {
      throw new UnauthorizedException('Oturum geçersiz veya süresi dolmuş.');
    }
    request.adminUser = payload.sub;
    return true;
  }
}
