import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSessionService } from './admin-session.service.js';
import { AdminUser } from './admin-user.entity.js';

/** Global: AdminGuard birden çok modülde kullanıldığı için oturum denetimi her yerden erişilebilir olmalı. */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AdminUser])],
  providers: [AdminSessionService],
  exports: [AdminSessionService],
})
export class AdminSessionModule {}
