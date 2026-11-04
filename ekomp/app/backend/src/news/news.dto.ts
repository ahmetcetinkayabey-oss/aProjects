import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug yalnızca küçük harf, rakam ve tire içerebilir.',
  })
  slug!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  summary!: string;

  @IsOptional()
  @IsString()
  content?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsOptional()
  @IsString()
  sourceName?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  sourceUrl?: string | null;

  @IsOptional()
  @IsString()
  dateLabel?: string | null;

  @IsDateString()
  publishedAt!: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  titleEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  summaryEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  contentEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoryEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sourceNameEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dateLabelEn?: string | null;
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  category?: string | null;

  @IsOptional()
  @IsString()
  sourceName?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  sourceUrl?: string | null;

  @IsOptional()
  @IsString()
  dateLabel?: string | null;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  titleEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  summaryEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50000)
  contentEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  categoryEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sourceNameEn?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  dateLabelEn?: string | null;
}
