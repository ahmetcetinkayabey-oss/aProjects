import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpsertContentDto {
  @IsString()
  @MaxLength(4000)
  tr!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  en?: string | null;
}
