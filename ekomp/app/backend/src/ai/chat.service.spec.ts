import { describe, expect, it, vi } from 'vitest';
import { ChatService } from './chat.service.js';
import type { AiService } from './ai.service.js';
import type { FacilitiesService } from '../facilities/facilities.service.js';

function make() {
  const generate = vi.fn().mockResolvedValue('cevap');
  const findAll = vi.fn().mockResolvedValue([
    { title: 'Yüzme Havuzu', category: 'YÜZME', description: 'Olimpik havuz', details: 'Detay', descriptionEn: null, detailsEn: null },
  ]);
  const svc = new ChatService({ generate } as unknown as AiService, { findAll } as unknown as FacilitiesService);
  return { svc, generate, findAll };
}

describe('ChatService', () => {
  it('tesis verisini sistem talimatına koyar ve ziyaretçi mesajını girdi yapar', async () => {
    const { svc, generate } = make();
    await expect(svc.reply([{ role: 'user', text: 'selam' }], 'Havuz var mı?')).resolves.toBe('cevap');
    const [system, input] = generate.mock.calls[0] as [string, string];
    expect(system).toContain('Yüzme Havuzu');
    expect(system).toContain('FACILITY DATA');
    expect(input).toContain('Visitor: Havuz var mı?');
    expect(input).toContain('Visitor: selam');
  });

  it('günlük sınır aşılınca 429 verir', async () => {
    process.env.CHAT_DAILY_LIMIT = '2';
    const { svc } = make();
    await svc.reply([], 'a');
    await svc.reply([], 'b');
    await expect(svc.reply([], 'c')).rejects.toMatchObject({ status: 429 });
    delete process.env.CHAT_DAILY_LIMIT;
  });
});
