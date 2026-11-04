import type { ConfigService } from '@nestjs/config';
import { describe, expect, it } from 'vitest';
import { NotificationsService } from './notifications.service.js';

/** ConfigService yerine yalnızca get() sağlayan sahte nesne. */
const serviceWith = (values: Record<string, string>) =>
  new NotificationsService({
    get: (key: string) => values[key],
  } as unknown as ConfigService);

describe('NotificationsService', () => {
  it('SMTP ayarı yoksa kapalıdır ve hata fırlatmadan atlar', async () => {
    const service = serviceWith({});
    expect(service.enabled).toBe(false);
    await expect(
      service.notify({ subject: 'x', text: 'y' }),
    ).resolves.toBeUndefined();
  });

  it('SMTP_HOST ve NOTIFY_TO birlikte tanımlıysa yönetici bildirimi açıktır', () => {
    expect(
      serviceWith({ SMTP_HOST: 'smtp.example.com', NOTIFY_TO: 'a@b.com' })
        .enabled,
    ).toBe(true);
    expect(serviceWith({ SMTP_HOST: 'smtp.example.com' }).enabled).toBe(false);
  });

  it('canSendMail yalnızca SMTP_HOST ile açılır; NOTIFY_TO gerekmez', () => {
    expect(serviceWith({ SMTP_HOST: 'smtp.example.com' }).canSendMail).toBe(
      true,
    );
    expect(serviceWith({}).canSendMail).toBe(false);
  });

  it('SMTP yoksa sendMail false döner, hata fırlatmaz', async () => {
    await expect(
      serviceWith({}).sendMail({ to: 'a@b.com', subject: 'x', text: 'y' }),
    ).resolves.toBe(false);
  });

  it('ulaşılamayan SMTP sunucusunda sendMail false döner', async () => {
    const service = serviceWith({
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: '1',
      NOTIFY_TO: 'a@b.com',
      NOTIFY_FROM: 'c@d.com',
    });
    await expect(
      service.sendMail({
        to: 'a@b.com',
        subject: 'konu\nBcc: x@y.com',
        text: 'metin',
      }),
    ).resolves.toBe(false);
    await expect(
      service.notify({ subject: 'x', text: 'y' }),
    ).resolves.toBeUndefined();
  });
});
