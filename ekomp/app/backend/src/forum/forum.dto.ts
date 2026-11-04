import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  CONFIRMATIONS,
  FORUM_DAYS,
  MEDIA_KINDS,
  PARTICIPANT_CATEGORIES,
  PARTICIPANT_STATUSES,
  SESSION_STATUSES,
  SESSION_TYPES,
} from './forum.entities.js';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const VISIBILITIES = ['PUBLIC', 'PARTICIPANTS', 'HIDDEN'];

export class RegisterDto {
  @IsString() @MinLength(2) @MaxLength(80) firstName!: string;
  @IsString() @MinLength(2) @MaxLength(80) lastName!: string;
  @IsEmail() @MaxLength(160) email!: string;
  @IsString() @MinLength(7) @MaxLength(30) phone!: string;
  @IsString() @MinLength(2) @MaxLength(80) country!: string;
  @IsString() @MinLength(2) @MaxLength(80) city!: string;
  @IsString() @MinLength(2) @MaxLength(160) organization!: string;
  @IsString() @MinLength(2) @MaxLength(120) jobTitle!: string;
  @IsIn(PARTICIPANT_CATEGORIES) category!: string;
  @IsOptional() @IsString() @MaxLength(1000) bio?: string;
  @IsOptional() @IsBoolean() wantsB2B?: boolean;
  @IsOptional() @IsIn(VISIBILITIES) visibility?: string;
  @IsString() @MinLength(8) @MaxLength(128) password!: string;
  /** Kişisel verilerin işlenmesine ilişkin aydınlatma metninin okunduğu onayı. */
  @IsBoolean() privacyAccepted!: boolean;
}

export class ForumLoginDto {
  @IsEmail() email!: string;
  @IsString() @MaxLength(128) password!: string;
}

export class TokenDto {
  @IsString() @MinLength(20) @MaxLength(200) token!: string;
}

export class ForgotPasswordDto {
  @IsEmail() email!: string;
}

export class ResetPasswordDto extends TokenDto {
  @IsString() @MinLength(8) @MaxLength(128) password!: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) firstName?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) lastName?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) organization?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) jobTitle?: string;
  @IsOptional() @IsString() @MinLength(7) @MaxLength(30) phone?: string;
  @IsOptional() @IsString() @MaxLength(1000) bio?: string;
  @IsOptional() @IsString() @MaxLength(300) interests?: string;
  @IsOptional() @IsString() @MaxLength(300) photoUrl?: string;
  @IsOptional() @IsIn(VISIBILITIES) visibility?: string;
  @IsOptional() @IsBoolean() shareContact?: boolean;
  @IsOptional() @IsBoolean() wantsB2B?: boolean;
}

export class UpdateParticipantDto {
  @IsOptional() @IsIn(PARTICIPANT_STATUSES) status?: string;
  @IsOptional() @IsString() @MaxLength(2000) adminNote?: string | null;
  /** Yönetici e-postayı elle doğrulayabilir (e-posta altyapısı yokken). */
  @IsOptional() @IsBoolean() verifyEmail?: boolean;
}

export class SessionDto {
  @IsIn(FORUM_DAYS) day!: string;
  @Matches(TIME, { message: 'Saat HH:mm biçiminde olmalı.' })
  startTime!: string;
  @Matches(TIME, { message: 'Saat HH:mm biçiminde olmalı.' }) endTime!: string;
  @IsOptional() @IsString() @MaxLength(120) room?: string;
  @IsString() @MinLength(2) @MaxLength(200) titleTr!: string;
  @IsOptional() @IsString() @MaxLength(200) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(3000) descriptionTr?: string;
  @IsOptional() @IsString() @MaxLength(3000) descriptionEn?: string;
  @IsIn(SESSION_TYPES) type!: string;
  @IsOptional() @IsString() @MaxLength(120) moderator?: string;
  @IsIn(SESSION_STATUSES) status!: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  speakerIds?: string[];
}

export class SpeakerDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsOptional() @IsString() @MaxLength(160) titleTr?: string;
  @IsOptional() @IsString() @MaxLength(160) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(160) organization?: string;
  @IsOptional() @IsString() @MaxLength(80) country?: string;
  @IsOptional() @IsString() @MaxLength(300) photoUrl?: string | null;
  @IsOptional() @IsString() @MaxLength(4000) bioTr?: string;
  @IsOptional() @IsString() @MaxLength(4000) bioEn?: string;
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsUrl({ require_protocol: true }, { each: true })
  links?: string[];
  @IsIn(CONFIRMATIONS) confirmation!: string;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

export class MediaDto {
  @IsIn(MEDIA_KINDS) kind!: string;
  @IsOptional() @IsString() @MaxLength(300) url?: string | null;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @Matches(
    /^https:\/\/(www\.)?(youtube\.com|youtu\.be|player\.vimeo\.com|vimeo\.com)\//,
    {
      message: 'Yalnızca YouTube veya Vimeo bağlantısı kullanılabilir.',
    },
  )
  videoUrl?: string | null;
  @IsOptional() @IsString() @MaxLength(200) titleTr?: string;
  @IsOptional() @IsString() @MaxLength(200) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(1000) descriptionTr?: string;
  @IsOptional() @IsString() @MaxLength(1000) descriptionEn?: string;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}

export class AnnouncementDto {
  @IsString() @MinLength(2) @MaxLength(200) titleTr!: string;
  @IsOptional() @IsString() @MaxLength(200) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(5000) contentTr?: string;
  @IsOptional() @IsString() @MaxLength(5000) contentEn?: string;
  @IsDateString() publishedAt!: string;
  @IsOptional() @IsBoolean() published?: boolean;
}

export class SponsorDto {
  @IsString() @MinLength(2) @MaxLength(160) name!: string;
  @IsOptional() @IsString() @MaxLength(300) logoUrl?: string | null;
  @IsOptional() @IsUrl({ require_protocol: true }) website?: string | null;
  @IsIn(CONFIRMATIONS) confirmation!: string;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}
