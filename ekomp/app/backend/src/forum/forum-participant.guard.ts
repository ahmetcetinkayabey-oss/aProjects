import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { verifyToken } from '../admin/admin-token.js';
import { ForumAuthService } from './forum-auth.service.js';

export type ParticipantRequest = Request & { participantId: string };

@Injectable()
export class ParticipantGuard implements CanActivate {
  constructor(private readonly auth: ForumAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ParticipantRequest>();
    const header = request.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const payload = token
      ? this.auth.verifyParticipantToken(token, verifyToken)
      : null;
    if (!payload)
      throw new UnauthorizedException('Oturum geçersiz veya süresi dolmuş.');
    request.participantId = payload.sub;
    return true;
  }
}
