import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard, RequirePermission, type PrincipalRequest } from './access.guard.js';
import { AuditService } from './audit.service.js';
import {
  AuditQueryDto,
  CreatePersonnelDto,
  PageQueryDto,
  SetRolesDto,
  SetStatusDto,
  UserChangePasswordDto,
  UserLoginDto,
} from './identity.dto.js';
import { Actor, IdentityService } from './identity.service.js';

const actorOf = (req: PrincipalRequest, ip: string): Actor => ({
  userId: req.principal.userId ?? null,
  label: req.principal.label,
  ip,
});

/** Kullanıcı girişi ve oturum. Yönetici girişi (/api/admin/login) ayrıdır ve değişmemiştir. */
@Controller('auth')
export class AuthController {
  constructor(private readonly identity: IdentityService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: UserLoginDto, @Ip() ip: string) {
    return this.identity.login(dto.email, dto.password, ip);
  }

  @Get('me')
  @UseGuards(AccessGuard)
  me(@Req() req: PrincipalRequest) {
    if (req.principal.kind !== 'user' || !req.principal.userId) {
      // Eski yönetici oturumu kullanıcı kaydı değildir.
      return { kind: 'admin', username: req.principal.label };
    }
    return this.identity.me(req.principal.userId);
  }

  @Post('password')
  @UseGuards(AccessGuard)
  @HttpCode(204)
  async changePassword(@Req() req: PrincipalRequest, @Body() dto: UserChangePasswordDto, @Ip() ip: string) {
    if (!req.principal.userId) throw new UnauthorizedException('Bu oturum için parola değiştirilemez.');
    await this.identity.changePassword(req.principal.userId, dto.currentPassword, dto.newPassword, ip);
  }
}

/** Kullanıcı yönetimi (izin: user:manage). */
@Controller('users')
@UseGuards(AccessGuard)
@RequirePermission('user:manage')
export class UsersController {
  constructor(private readonly identity: IdentityService) {}

  @Get()
  list(@Query() q: PageQueryDto) {
    return this.identity.listUsers(q.page, q.pageSize, q.q);
  }

  @Post()
  create(@Req() req: PrincipalRequest, @Body() dto: CreatePersonnelDto, @Ip() ip: string) {
    return this.identity.createPersonnel(dto, actorOf(req, ip));
  }

  @Patch(':id/roles')
  setRoles(
    @Req() req: PrincipalRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetRolesDto,
    @Ip() ip: string,
  ) {
    return this.identity.setRoles(id, dto.roleCodes, actorOf(req, ip));
  }

  @Patch(':id/status')
  setStatus(
    @Req() req: PrincipalRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetStatusDto,
    @Ip() ip: string,
  ) {
    return this.identity.setStatus(id, dto.status, actorOf(req, ip));
  }
}

/** Denetim kayıtları (izin: audit:view). */
@Controller('audit')
@UseGuards(AccessGuard)
@RequirePermission('audit:view')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(@Query() q: AuditQueryDto) {
    return this.audit.list({ entity: q.entity, entityId: q.entityId, page: q.page, pageSize: q.pageSize });
  }
}
