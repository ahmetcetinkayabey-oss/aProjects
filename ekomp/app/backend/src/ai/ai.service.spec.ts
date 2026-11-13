import { afterEach, describe, expect, it } from 'vitest';
import { ServiceUnavailableException } from '@nestjs/common';
import { AiService } from './ai.service.js';

describe('AiService', () => {
  const saved = process.env.GEMINI_API_KEY;
  afterEach(() => {
    if (saved === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = saved;
  });

  it('anahtar yoksa açık bir hata verir', async () => {
    delete process.env.GEMINI_API_KEY;
    const s = new AiService();
    expect(s.enabled).toBe(false);
    await expect(s.transform('polish', 'merhaba')).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
