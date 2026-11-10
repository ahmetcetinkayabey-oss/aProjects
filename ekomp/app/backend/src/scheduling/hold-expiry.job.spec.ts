import { afterEach, describe, expect, it, vi } from 'vitest';
import { HoldExpiryJob } from './hold-expiry.job.js';

afterEach(() => vi.useRealTimers());

describe('HoldExpiryJob', () => {
  it('belirtilen aralıkta temizliği çağırır; kapanınca durur', async () => {
    vi.useFakeTimers();
    const expireHolds = vi.fn(async () => 0);
    const job = new HoldExpiryJob({ expireHolds });
    job.onModuleInit(1000);
    await vi.advanceTimersByTimeAsync(3100);
    expect(expireHolds).toHaveBeenCalledTimes(3);
    job.onModuleDestroy();
    await vi.advanceTimersByTimeAsync(5000);
    expect(expireHolds).toHaveBeenCalledTimes(3);
  });

  it('temizlik hata verse bile zamanlayıcıyı bozmaz', async () => {
    const job = new HoldExpiryJob({ expireHolds: async () => { throw new Error('db yok'); } });
    await expect(job.run()).resolves.toBe(0);
  });
});
