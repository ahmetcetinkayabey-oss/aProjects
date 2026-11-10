import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TypeOrmBookingsService } from './bookings.service.js';

const FIVE_MINUTES = 5 * 60 * 1000;

/**
 * Süresi dolan geçici tutmaları periyodik olarak serbest bırakır ve talepleri EXPIRED yapar.
 * Müsaitlik zaten süresi dolmuş tutmayı saymaz; bu iş durum ve geçmiş kayıtlarının tutarlı kalması içindir.
 * Tek örnekte çalışır; çok örnekli kurulumda işlem idempotent olduğundan çift çalışma zararsızdır.
 */
@Injectable()
export class HoldExpiryJob implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HoldExpiryJob.name);
  private timer?: NodeJS.Timeout;

  constructor(private readonly bookings: Pick<TypeOrmBookingsService, 'expireHolds'>) {}

  onModuleInit(intervalMs = FIVE_MINUTES) {
    this.timer = setInterval(() => void this.run(), intervalMs);
    this.timer.unref(); // süreç kapanmasını engellemesin
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async run(): Promise<number> {
    try {
      const n = await this.bookings.expireHolds();
      if (n > 0) this.logger.log(`${n} talebin tutma süresi doldu; kaynaklar serbest bırakıldı.`);
      return n;
    } catch (e) {
      this.logger.error('Tutma süresi temizliği başarısız', e as Error);
      return 0;
    }
  }
}
