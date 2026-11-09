import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessGuard } from './access.guard.js';
import { AuditLog } from './audit-log.entity.js';
import { AuditService } from './audit.service.js';
import { AuditController, AuthController, UsersController } from './identity.controller.js';
import { IdentityService } from './identity.service.js';
import { Permission } from './permission.entity.js';
import { Role } from './role.entity.js';
import { User } from './user.entity.js';

/** Kimlik, rol/izin ve denetim kaydı. Diğer modüller AccessGuard + @RequirePermission ile korunur. */
@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, AuditLog])],
  controllers: [AuthController, UsersController, AuditController],
  providers: [IdentityService, AuditService, AccessGuard],
  exports: [IdentityService, AuditService, AccessGuard],
})
export class IdentityModule {}
