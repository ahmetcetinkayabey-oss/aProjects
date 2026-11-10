import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './admin-user.entity.js';
import { issuedAt } from './admin-token.js';

/**
 * Yönetici oturumunun hâlâ geçerli olduğunu doğrular: hesap silinmemiş olmalı ve belirteç,
 * son parola değişikliğinden SONRA alınmış olmalı (parola değişince eski oturumlar kapanır).
 */
@Injectable()
export class AdminSessionService {
  constructor(@InjectRepository(AdminUser) private readonly users: Repository<AdminUser>) {}

  async isCurrent(username: string, exp: number): Promise<boolean> {
    const user = await this.users.findOneBy({ username });
    if (!user) return false;
    if (!user.passwordChangedAt) return true;
    return issuedAt(exp) >= new Date(user.passwordChangedAt).getTime();
  }
}
