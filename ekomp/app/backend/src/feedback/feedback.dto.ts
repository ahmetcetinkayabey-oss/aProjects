import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export const FEEDBACK_CATEGORIES = [
  'Öneri',
  'Şikayet',
  'Teşekkür',
  'Diğer',
] as const;

export class CreateFeedbackDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  @IsIn(FEEDBACK_CATEGORIES)
  category!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  message!: string;
}

export class UpdateFeedbackDto {
  @IsBoolean()
  handled!: boolean;
}
