import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module.js';
import { SchedulingController } from './scheduling.controller.js';
import { TypeOrmSchedulingService } from './scheduling.service.js';

/** Kaynak/müsaitlik uçları. Tablolar 002 migration'ındadır; yalnızca PostgreSQL'de (üretim) kaydedilir. */
@Module({
  imports: [IdentityModule],
  controllers: [SchedulingController],
  providers: [TypeOrmSchedulingService],
  exports: [TypeOrmSchedulingService],
})
export class SchedulingModule {}
