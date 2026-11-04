import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_MESSAGE = 'slug yalnızca küçük harf, rakam ve tire içerebilir.';

export class FacilityStatDto {
  @IsString()
  label!: string;

  @IsString()
  value!: string;
}

export class CreateFacilityDto {
  @IsString()
  @Matches(SLUG_PATTERN, { message: SLUG_MESSAGE })
  slug!: string;

  @IsString() @MinLength(2) category!: string;
  @IsString() @MinLength(2) icon!: string;
  @IsString() @MinLength(2) title!: string;
  @IsString() @MinLength(2) description!: string;
  @IsString() badge!: string;
  @IsString() footerLeft!: string;
  @IsString() footerRight!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacilityStatDto)
  stats?: FacilityStatDto[] | null;

  @IsOptional() @IsString() @MaxLength(100) categoryEn?: string | null;
  @IsOptional() @IsString() @MaxLength(300) titleEn?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) descriptionEn?: string | null;
  @IsOptional() @IsString() @MaxLength(100) badgeEn?: string | null;
  @IsOptional() @IsString() @MaxLength(200) footerLeftEn?: string | null;
  @IsOptional() @IsString() @MaxLength(200) footerRightEn?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacilityStatDto)
  statsEn?: FacilityStatDto[] | null;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateFacilityDto {
  @IsOptional()
  @IsString()
  @Matches(SLUG_PATTERN, { message: SLUG_MESSAGE })
  slug?: string;
  @IsOptional() @IsString() @MinLength(2) category?: string;
  @IsOptional() @IsString() @MinLength(2) icon?: string;
  @IsOptional() @IsString() @MinLength(2) title?: string;
  @IsOptional() @IsString() @MinLength(2) description?: string;
  @IsOptional() @IsString() badge?: string;
  @IsOptional() @IsString() footerLeft?: string;
  @IsOptional() @IsString() footerRight?: string;
  @IsOptional() @IsString() imageUrl?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacilityStatDto)
  stats?: FacilityStatDto[] | null;

  @IsOptional() @IsString() @MaxLength(100) categoryEn?: string | null;
  @IsOptional() @IsString() @MaxLength(300) titleEn?: string | null;
  @IsOptional() @IsString() @MaxLength(5000) descriptionEn?: string | null;
  @IsOptional() @IsString() @MaxLength(100) badgeEn?: string | null;
  @IsOptional() @IsString() @MaxLength(200) footerLeftEn?: string | null;
  @IsOptional() @IsString() @MaxLength(200) footerRightEn?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacilityStatDto)
  statsEn?: FacilityStatDto[] | null;

  @IsOptional() @IsInt() sortOrder?: number;
}
