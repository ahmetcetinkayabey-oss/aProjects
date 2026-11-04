import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { IsNull, Repository } from 'typeorm';
import {
  createToken,
  hashPassword,
  verifyPassword,
} from '../admin/admin-token.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import type { RegisterDto, UpdateProfileDto } from './forum.dto.js';
import { ForumParticipant, ForumToken } from './forum.entities.js';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const VERIFY_TTL_MS = 48 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

/** Katılımcı kendi bilgilerini görür; şifre özeti hiçbir zaman dışarı çıkmaz. */
export type OwnProfile = Omit<ForumParticipant, 'passwordHash'>;

@Injectable()
export class ForumAuthService {
  private readonly logger = new Logger(ForumAuthService.name);
  private readonly attempts = new Map<
    string,
    { count: number; first: number }
  >();

  constructor(
    @InjectRepository(ForumParticipant)
    private readonly users: Repository<ForumParticipant>,
    @InjectRepository(ForumToken)
    private readonly tokens: Repository<ForumToken>,
    private readonly config: ConfigService,
    private readonly mail: NotificationsService,
  ) {}

  /** Yönetici jetonundan farklı bir anahtar kullanılır; iki jeton türü birbirinin yerine geçemez. */
  private get secret(): string {
    return `${this.config.getOrThrow<string>('ADMIN_TOKEN_SECRET')}:forum-participant`;
  }

  async register(dto: RegisterDto): Promise<{ ok: true }> {
    if (!dto.privacyAccepted) {
      throw new BadRequestException(
        'Kişisel veri aydınlatma metnini onaylamanız gerekir.',
      );
    }
    const email = dto.email.trim().toLowerCase();
    if (await this.users.existsBy({ email })) {
      throw new ConflictException(
        'Bu e-posta adresiyle zaten bir başvuru var.',
      );
    }
    const user = await this.users.save(
      this.users.create({
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        email,
        phone: dto.phone.trim(),
        country: dto.country.trim(),
        city: dto.city.trim(),
        organization: dto.organization.trim(),
        jobTitle: dto.jobTitle.trim(),
        category: dto.category,
        bio: dto.bio?.trim() || null,
        wantsB2B: dto.wantsB2B ?? false,
        visibility: dto.visibility ?? 'PARTICIPANTS',
        passwordHash: await hashPassword(dto.password),
        privacyConsentAt: new Date(),
      }),
    );
    await this.sendLink(user, 'VERIFY');
    return { ok: true };
  }

  async verifyEmail(token: string): Promise<{ ok: true }> {
    const row = await this.consume(token, 'VERIFY');
    await this.users.update(row.participantId, { emailVerifiedAt: new Date() });
    return { ok: true };
  }

  async login(
    email: string,
    password: string,
    ip: string,
  ): Promise<{ token: string }> {
    this.assertNotLocked(ip);
    const user = await this.users.findOne({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        passwordHash: true,
        emailVerifiedAt: true,
        status: true,
      },
    });
    const valid = user
      ? await verifyPassword(password, user.passwordHash)
      : false;
    if (!user || !valid) {
      this.recordFailure(ip);
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }
    if (!user.emailVerifiedAt)
      throw new ForbiddenException('EMAIL_NOT_VERIFIED');
    if (user.status === 'CANCELLED')
      throw new ForbiddenException('ACCOUNT_CANCELLED');
    this.attempts.delete(ip);
    return { token: createToken(user.id, this.secret) };
  }

  /** Hesap var mı yok mu belli etmemek için her zaman aynı yanıt döner. */
  async forgotPassword(email: string): Promise<{ ok: true }> {
    const user = await this.users.findOneBy({
      email: email.trim().toLowerCase(),
    });
    if (user) await this.sendLink(user, 'RESET');
    return { ok: true };
  }

  async resetPassword(token: string, password: string): Promise<{ ok: true }> {
    const row = await this.consume(token, 'RESET');
    await this.users.update(row.participantId, {
      passwordHash: await hashPassword(password),
      emailVerifiedAt: new Date(),
    });
    return { ok: true };
  }

  async getProfile(id: string): Promise<OwnProfile> {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<OwnProfile> {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new UnauthorizedException();
    return this.users.save(Object.assign(user, dto));
  }

  /** İmzalı jetondan katılımcı kimliğini çıkarır (guard tarafından kullanılır). */
  verifyParticipantToken(
    token: string,
    verify: (t: string, secret: string) => { sub: string } | null,
  ) {
    return verify(token, this.secret);
  }

  private async sendLink(
    user: ForumParticipant,
    type: 'VERIFY' | 'RESET',
  ): Promise<void> {
    const raw = randomBytes(32).toString('base64url');
    await this.tokens.save(
      this.tokens.create({
        participantId: user.id,
        type,
        tokenHash: sha256(raw),
        expiresAt: new Date(
          Date.now() + (type === 'VERIFY' ? VERIFY_TTL_MS : RESET_TTL_MS),
        ),
      }),
    );
    const base = this.config.get<string>(
      'FORUM_PUBLIC_URL',
      'http://localhost:3000',
    );
    const path = type === 'VERIFY' ? 'dogrula' : 'sifre-sifirla';
    const link = `${base}/forum/${path}?token=${raw}`;
    // Geliştirmede bağlantı konsola da yazılır; üretimde jeton asla loglanmaz.
    if (this.config.get<string>('NODE_ENV') !== 'production') {
      this.logger.log(`[DEV] ${type} bağlantısı: ${link}`);
    }
    if (!this.mail.canSendMail) {
      this.logger.warn(
        'SMTP tanımlı değil: forum e-postası gönderilemedi. SMTP_HOST ayarlayın veya e-postayı yönetici panelinden elle doğrulayın.',
      );
      return;
    }
    const hours =
      type === 'VERIFY' ? VERIFY_TTL_MS / 3_600_000 : RESET_TTL_MS / 3_600_000;
    const name = user.firstName;
    const tr =
      type === 'VERIFY'
        ? `Merhaba ${name},\n\nPalandöken 2027 Forumu başvurunuz alındı. E-posta adresinizi doğrulamak için bağlantıya tıklayın (${hours} saat geçerlidir):\n${link}\n\nBu başvuruyu siz yapmadıysanız bu e-postayı yok sayabilirsiniz.`
        : `Merhaba ${name},\n\nŞifrenizi sıfırlamak için bağlantıya tıklayın (${hours} saat geçerlidir):\n${link}\n\nBu talebi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.`;
    const en =
      type === 'VERIFY'
        ? `Hello ${name},\n\nWe have received your Palandöken 2027 Forum registration. Please verify your email address using this link (valid for ${hours} hours):\n${link}\n\nIf you did not register, you can ignore this email.`
        : `Hello ${name},\n\nUse this link to reset your password (valid for ${hours} hour(s)):\n${link}\n\nIf you did not request this, you can ignore this email.`;
    await this.mail.sendMail({
      to: user.email,
      subject:
        type === 'VERIFY'
          ? 'E-posta doğrulama / Verify your email — Palandöken 2027 Forum'
          : 'Şifre sıfırlama / Password reset — Palandöken 2027 Forum',
      text: `${tr}\n\n----------\n\n${en}\n`,
    });
  }

  private async consume(
    token: string,
    type: 'VERIFY' | 'RESET',
  ): Promise<ForumToken> {
    const row = await this.tokens.findOneBy({
      tokenHash: sha256(token),
      type,
      usedAt: IsNull(),
    });
    if (!row || row.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Bağlantı geçersiz veya süresi dolmuş.');
    }
    row.usedAt = new Date();
    await this.tokens.save(row);
    return row;
  }

  private assertNotLocked(ip: string): void {
    const entry = this.attempts.get(ip);
    if (!entry) return;
    if (Date.now() - entry.first > WINDOW_MS) {
      this.attempts.delete(ip);
      return;
    }
    if (entry.count >= MAX_ATTEMPTS) {
      throw new UnauthorizedException(
        'Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin.',
      );
    }
  }

  private recordFailure(ip: string): void {
    const entry = this.attempts.get(ip);
    if (!entry || Date.now() - entry.first > WINDOW_MS) {
      this.attempts.set(ip, { count: 1, first: Date.now() });
    } else {
      entry.count += 1;
    }
  }
}
