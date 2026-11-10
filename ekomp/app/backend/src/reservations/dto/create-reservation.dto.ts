import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/**
 * Yazım biçimi ne olursa olsun (0555 111 22 33, 555 111 22 33, 0 (555) 111-22-33, 0090…, +44…) uluslararası
 * biçime (+90…) çevirir; doğrulama ve yönetici panelindeki WhatsApp/arama bağlantıları bu biçimle çalışır.
 */
export function normalizePhone({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') return value;
  const raw = value.trim();
  const digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) return '+' + digits;
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (digits.startsWith('0') && digits.length === 11) return '+90' + digits.slice(1);
  if (digits.length === 10 && digits.startsWith('5')) return '+90' + digits;
  return raw;
}

export class CreateReservationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  organizationName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  contactName!: string;

  @IsEmail()
  @MaxLength(200)
  email!: string;

  @Transform(normalizePhone)
  @IsPhoneNumber(undefined, { message: 'Geçerli bir telefon numarası girin (örn. 0555 111 22 33 veya +44 7911 123456).' })
  @MaxLength(30)
  phone!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  sportBranch!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  groupSize?: number;

  @IsOptional()
  @IsDateString()
  preferredStartDate?: string;

  @IsOptional()
  @IsDateString()
  preferredEndDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}
