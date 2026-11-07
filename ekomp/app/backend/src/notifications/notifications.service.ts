import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransport, type Transporter } from 'nodemailer';
import { Repository } from 'typeorm';
import { AppSetting } from './app-setting.entity.js';
import { decryptSecret, encryptSecret } from './settings-crypto.js';

export interface MailMessage {
  subject: string;
  text: string;
}

export interface OutgoingMail extends MailMessage {
  to: string;
}

/** Panelden değiştirilebilen e-posta ayarları (anahtar adları .env ile aynıdır). */
export const MAIL_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'NOTIFY_FROM',
  'NOTIFY_TO',
] as const;
export type MailKey = (typeof MAIL_KEYS)[number];

export interface MailSettingsInput {
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  /** Boş/undefined: mevcut anahtar korunur. */
  smtpPass?: string;
  notifyFrom?: string;
  notifyTo?: string;
}

export interface MailStatus {
  smtpHost: string | null;
  smtpPort: string | null;
  smtpUser: string | null;
  smtpPassSet: boolean;
  from: string | null;
  notifyTo: string | null;
  ready: boolean;
  /** Ayarlar panelden mi (db) yoksa .env'den mi geliyor. */
  fromPanel: boolean;
}

/** E-posta konusuna satır sonu enjekte edilmesini önler. */
const oneLine = (value: string): string =>
  value.replace(/[\r\n]+/g, ' ').trim() || '-';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: Transporter | null | undefined;
  /** Panelden girilmiş ayarlar (SMTP_PASS çözülmüş hâlde, yalnızca bellekte). */
  private overrides = new Map<MailKey, string>();

  constructor(
    private readonly config: ConfigService,
    @Optional()
    @InjectRepository(AppSetting)
    private readonly repo?: Repository<AppSetting>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.reload();
  }

  private secret(): string {
    return this.config.get<string>('ADMIN_TOKEN_SECRET') ?? 'ekomp-dev-secret';
  }

  private async reload(): Promise<void> {
    this.transporter = undefined;
    this.overrides = new Map();
    if (!this.repo) return;
    const rows = await this.repo.find();
    for (const row of rows) {
      if (!(MAIL_KEYS as readonly string[]).includes(row.key)) continue;
      const value =
        row.key === 'SMTP_PASS' ? decryptSecret(row.value, this.secret()) : row.value;
      if (value) this.overrides.set(row.key as MailKey, value);
    }
  }

  /** Panel ayarı varsa o, yoksa .env değeri. */
  private get(key: MailKey): string | undefined {
    return this.overrides.get(key) ?? (this.config.get<string>(key) || undefined);
  }

  /** SMTP_HOST tanımlıysa e-posta gönderilebilir (kullanıcıya gidecek doğrulama/sıfırlama e-postaları için). */
  get canSendMail(): boolean {
    return !!this.get('SMTP_HOST');
  }

  /** Yönetici bildirimleri için ayrıca NOTIFY_TO gerekir. */
  get enabled(): boolean {
    return this.canSendMail && !!this.get('NOTIFY_TO');
  }

  private getTransporter(): Transporter | null {
    if (this.transporter !== undefined) return this.transporter;
    if (!this.canSendMail) return (this.transporter = null);
    const user = this.get('SMTP_USER');
    const pass = this.get('SMTP_PASS');
    const port = Number(this.get('SMTP_PORT') ?? 587);
    this.transporter = createTransport({
      host: this.get('SMTP_HOST'),
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
      // SMTP sunucusu yanıt vermezse istek (ör. forum kaydı) uzun süre asılı kalmasın.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    });
    return this.transporter;
  }

  private fromAddress(): string | undefined {
    return this.get('NOTIFY_FROM') ?? this.get('SMTP_USER');
  }

  /** Hata fırlatmaz; gönderildiyse true döner. İstekleri başarısız e-postayla bozmamak için sonuç yalnızca bilgi amaçlıdır. */
  async sendMail(mail: OutgoingMail): Promise<boolean> {
    const transporter = this.getTransporter();
    if (!transporter) return false;
    try {
      await transporter.sendMail({
        from: this.fromAddress(),
        to: mail.to,
        subject: oneLine(mail.subject),
        text: mail.text,
      });
      return true;
    } catch (err) {
      this.logger.warn(
        `E-posta gönderilemedi: ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }

  /** Panelde gösterilen kurulum durumu (SMTP anahtarı asla döndürülmez). */
  status(): MailStatus {
    const host = this.get('SMTP_HOST') ?? null;
    const from = this.fromAddress() ?? null;
    return {
      smtpHost: host,
      smtpPort: this.get('SMTP_PORT') ?? null,
      smtpUser: this.get('SMTP_USER') ?? null,
      smtpPassSet: !!this.get('SMTP_PASS'),
      from: this.get('NOTIFY_FROM') ?? null,
      notifyTo: this.get('NOTIFY_TO') ?? null,
      ready: !!host && !!from,
      fromPanel: this.overrides.size > 0,
    };
  }

  /**
   * Ayarları panelden kaydeder. Boş bırakılan alan panel kaydını siler (.env değerine döner);
   * SMTP anahtarı boşsa mevcut anahtar korunur.
   */
  async saveSettings(input: MailSettingsInput): Promise<MailStatus> {
    if (!this.repo) throw new Error('Ayar deposu kullanılamıyor.');
    const entries: [MailKey, string | undefined][] = [
      ['SMTP_HOST', input.smtpHost],
      ['SMTP_PORT', input.smtpPort],
      ['SMTP_USER', input.smtpUser],
      ['NOTIFY_FROM', input.notifyFrom],
      ['NOTIFY_TO', input.notifyTo],
    ];
    for (const [key, raw] of entries) {
      if (raw === undefined) continue;
      const value = raw.trim();
      if (value) await this.repo.save({ key, value });
      else await this.repo.delete(key);
    }
    const pass = input.smtpPass?.trim();
    if (pass) {
      await this.repo.save({ key: 'SMTP_PASS', value: encryptSecret(pass, this.secret()) });
    }
    await this.reload();
    return this.status();
  }

  /** Kayıtlı SMTP anahtarını panelden siler. */
  async clearPassword(): Promise<MailStatus> {
    if (!this.repo) throw new Error('Ayar deposu kullanılamıyor.');
    await this.repo.delete('SMTP_PASS');
    await this.reload();
    return this.status();
  }

  /** Test e-postası: gönderim başarısızsa nedenini döndürür (panelde gösterilir). */
  async sendTest(to: string): Promise<{ ok: boolean; error?: string }> {
    const transporter = this.getTransporter();
    if (!transporter) {
      return {
        ok: false,
        error: 'SMTP sunucusu tanımlı değil. Önce yukarıdaki ayarları kaydedin.',
      };
    }
    try {
      await transporter.sendMail({
        from: this.fromAddress(),
        to,
        subject: 'Test e-postası – Erzurum Yüksek İrtifa Kamp Merkezi',
        text: 'Bu bir test e-postasıdır. Bunu okuyorsanız e-posta (SMTP) ayarlarınız doğru çalışıyor.',
      });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  /** Yöneticiye (NOTIFY_TO) bildirim gönderir. Ayar yoksa sessizce atlar. */
  async notify(message: MailMessage): Promise<void> {
    const to = this.get('NOTIFY_TO');
    if (!to) return;
    await this.sendMail({ ...message, to });
  }
}
