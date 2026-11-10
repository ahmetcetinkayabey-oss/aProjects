import { Module } from '@nestjs/common';
import { IdentityModule } from '../identity/identity.module.js';
import { BookingsController } from './bookings.controller.js';
import { TypeOrmBookingsService } from './bookings.service.js';
import { HoldExpiryJob } from './hold-expiry.job.js';
import { SchedulingController } from './scheduling.controller.js';
import { TypeOrmSchedulingService } from './scheduling.service.js';

/** Kaynak/müsaitlik uçları. Tablolar 002 migration'ındadır; yalnızca PostgreSQL'de (üretim) kaydedilir. */
@Module({
  imports: [IdentityModule],
  controllers: [SchedulingController, BookingsController],
  providers: [TypeOrmSchedulingService, TypeOrmBookingsService, HoldExpiryJob],
  exports: [TypeOrmSchedulingService],
})
export class SchedulingModule {}
