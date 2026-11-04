import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ReservationStatus } from '../reservations/reservation.entity.js';

export class LoginDto {
  @IsString() username!: string;
  @IsString() password!: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'Yeni şifre en az 8 karakter olmalı.' })
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
