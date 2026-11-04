import { describe, expect, it } from 'vitest';
import { RateLimiter } from './rate-limit.guard.js';

describe('RateLimiter', () => {
  it('limite kadar izin verir, sonrasını engeller', () => {
    const limiter = new RateLimiter(3, 1000);
    expect([1, 2, 3, 4].map(() => limiter.take('ip', 0))).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it('süre dolunca yeniden izin verir', () => {
    const limiter = new RateLimiter(1, 1000);
    expect(limiter.take('ip', 0)).toBe(true);
    expect(limiter.take('ip', 500)).toBe(false);
    expect(limiter.take('ip', 1001)).toBe(true);
  });

  it('IP adreslerini birbirinden bağımsız sayar', () => {
    const limiter = new RateLimiter(1, 1000);
    expect(limiter.take('a', 0)).toBe(true);
    expect(limiter.take('b', 0)).toBe(true);
    expect(limiter.take('a', 1)).toBe(false);
  });
});
