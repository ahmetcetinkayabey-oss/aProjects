import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

/** Aynı IP'den kısa sürede çok sayıda form gönderimini engeller (spam koruması). Bellek içi; tek sunucu için yeterlidir. */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** İzin verilirse true; limit aşıldıysa false döner. */
  take(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter(
      (t) => now - t < this.windowMs,
    );
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) this.prune(now);
    return true;
  }

  private prune(now: number): void {
    for (const [key, times] of this.hits) {
      if (times.every((t) => now - t >= this.windowMs)) this.hits.delete(key);
    }
  }
}

const HOUR_MS = 60 * 60 * 1000;

@Injectable()
export class PublicFormRateLimitGuard implements CanActivate {
  // Saatte IP başına 10 gönderim: gerçek kullanıcı için fazlasıyla yeterli, otomatik spam için kısıtlayıcı.
  private readonly limiter = new RateLimiter(10, HOUR_MS);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    if (!this.limiter.take(req.ip ?? 'unknown')) {
      throw new HttpException(
        'Çok fazla istek gönderdiniz. Lütfen biraz sonra tekrar deneyin.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
