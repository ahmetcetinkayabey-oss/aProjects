import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

export interface MailMessage {
  subject: string;
  text: string;
}

export interface OutgoingMail extends MailMessage {
  to: string;
}

/** E-posta konusuna satır sonu enjekte edilmesini önler. */
const oneLine = (value: string): string =>
  value.replace(/[\r\n]+/g, ' ').trim() || '-';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: Transporter | null | undefined;

  constructor(private readonly config: ConfigService) {}

  /** SMTP_HOST tanımlıysa e-posta gönderilebilir (kullanıcıya gidecek doğrulama/sıfırlama e-postaları için). */
  get canSendMail(): boolean {
    return !!this.config.get<string>('SMTP_HOST');
  }

  /** Yönetici bildirimleri için ayrıca NOTIFY_TO gerekir. */
  get enabled(): boolean {
    return this.canSendMail && !!this.config.get<string>('NOTIFY_TO');
  }

  private getTransporter(): Transporter | null {
    if (this.transporter !== undefined) return this.transporter;
    if (!this.canSendMail) return (this.transporter = null);
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);
    this.transporter = createTransport({
      host: this.config.get<string>('SMTP_HOST'),
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

  /** Hata fırlatmaz; gönderildiyse true döner. İstekleri başarısız e-postayla bozmamak için sonuç yalnızca bilgi amaçlıdır. */
  async sendMail(mail: OutgoingMail): Promise<boolean> {
    const transporter = this.getTransporter();
    if (!transporter) return false;
    try {
      await transporter.sendMail({
        from:
          this.config.get<string>('NOTIFY_FROM') ??
          this.config.get<string>('SMTP_USER'),
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

  /** Yöneticiye (NOTIFY_TO) bildirim gönderir. Ayar yoksa sessizce atlar. */
  async notify(message: MailMessage): Promise<void> {
    const to = this.config.get<string>('NOTIFY_TO');
    if (!to) return;
    await this.sendMail({ ...message, to });
  }
}
