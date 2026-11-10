import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './admin-user.entity.js';
import { createToken, hashPassword, verifyPassword } from './admin-token.js';

const COMMON_PASSWORDS = ['123456789', '12345678', '1234567890', 'password', 'admin123', 'qwerty123', '11111111', 'ekomp123'];
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

@Injectable()
export class AdminAuthService implements OnModuleInit {
  private readonly logger = new Logger(AdminAuthService.name);
  private readonly attempts = new Map<string, { count: number; first: number }>();
  private readonly weakCache = new Map<string, boolean>();

  constructor(
    @InjectRepository(AdminUser) private readonly users: Repository<AdminUser>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.users.count()) > 0) return;
    const username = this.config.getOrThrow<string>('ADMIN_USERNAME');
    const password = this.config.getOrThrow<string>('ADMIN_PASSWORD');
    await this.users.save({ username, passwordHash: await hashPassword(password) });
    this.logger.log(`İlk yönetici hesabı oluşturuldu: "${username}"`);
  }

  async login(username: string, password: string, ip: string): Promise<{ token: string }> {
    this.assertNotLocked(ip);
    const user = await this.users.findOneBy({ username });
    const valid = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !valid) {
      this.recordFailure(ip);
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı.');
    }
    this.attempts.delete(ip);
    return { token: createToken(user.username, this.config.getOrThrow<string>('ADMIN_TOKEN_SECRET')) };
  }

  async changePassword(username: string, current: string, next: string): Promise<void> {
    const user = await this.users.findOneBy({ username });
    if (!user || !(await verifyPassword(current, user.passwordHash))) {
      throw new UnauthorizedException('Mevcut şifre hatalı.');
    }
    user.passwordHash = await hashPassword(next);
    await this.users.save(user);
  }

  /**
   * Hesap hâlâ ilk kurulumdaki (.env ADMIN_PASSWORD) ya da çok yaygın/tahmin edilebilir bir şifre kullanıyorsa true.
   * Panel bu durumda şifreyi değiştirmeyi hatırlatır; yayına çıkmadan önce unutulmasın diye.
   * Sonuç şifre özeti (hash) başına önbelleğe alınır; böylece her istekte pahalı doğrulama yapılmaz.
   */
  async usesDefaultPassword(username: string): Promise<boolean> {
    const user = await this.users.findOneBy({ username });
    if (!user) return false;
    const cached = this.weakCache.get(user.passwordHash);
    if (cached !== undefined) return cached;
    const candidates = new Set([...COMMON_PASSWORDS, this.config.get<string>('ADMIN_PASSWORD') ?? '', username]);
    candidates.delete('');
    let weak = false;
    for (const candidate of candidates) {
      if (await verifyPassword(candidate, user.passwordHash)) {
        weak = true;
        break;
      }
    }
    this.weakCache.set(user.passwordHash, weak);
    return weak;
  }

  private assertNotLocked(ip: string): void {
    const entry = this.attempts.get(ip);
    if (!entry) return;
    if (Date.now() - entry.first > WINDOW_MS) {
      this.attempts.delete(ip);
      return;
    }
    if (entry.count >= MAX_ATTEMPTS) {
      throw new UnauthorizedException('Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin.');
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
