import { IsEmail, IsEnum, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { ReservationStatus } from '../reservations/reservation.entity.js';

export class LoginDto {
  @IsString() username!: string;
  @IsString() password!: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword!: string;

  @IsString()
  @MinLength(10, { message: 'Yeni şifre en az 10 karakter olmalı.' })
  newPassword!: string;
}

export class UpdateReservationDto {
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNote?: string | null;
}

export class MailTestDto {
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi girin.' })
  to!: string;
}

export class MailSettingsDto {
  @IsOptional() @IsString() @MaxLength(200) smtpHost?: string;

  @IsOptional()
  @Matches(/^\d{0,5}$/,{ message: 'Port yalnızca rakam olmalı.' })
  smtpPort?: string;

  @IsOptional() @IsString() @MaxLength(200) smtpUser?: string;

  @IsOptional() @IsString() @MaxLength(500) smtpPass?: string;

  @IsOptional() @IsString() @MaxLength(200) notifyFrom?: string;

  @IsOptional()
  @ValidateIf((o: MailSettingsDto) => !!o.notifyTo)
  @IsEmail({}, { message: 'Bildirim adresi geçerli bir e-posta olmalı.' })
  notifyTo?: string;
}

export class AiTextDto {
  @IsIn(['translate-en', 'translate-tr', 'polish', 'shorten'])
  action!: 'translate-en' | 'translate-tr' | 'polish' | 'shorten';

  @IsString()
  @MinLength(1)
  @MaxLength(12000)
  text!: string;
}
