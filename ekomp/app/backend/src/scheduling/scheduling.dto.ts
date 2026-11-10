import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsISO8601, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

const CODE = /^[A-Za-z0-9_-]{2,40}$/;
const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateTypeDto {
  @Transform(trim) @Matches(CODE, { message: 'Kod 2-40 karakter; harf, rakam, - ve _ içerebilir.' })
  code!: string;
  @Transform(trim) @IsString() @MinLength(2) @MaxLength(100)
  name!: string;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(30)
  capacityUnit?: string;
}

export class CreateResourceDto {
  @Transform(trim) @Matches(CODE, { message: 'Kod 2-40 karakter; harf, rakam, - ve _ içerebilir.' })
  code!: string;
  @Transform(trim) @IsString() @MinLength(2) @MaxLength(150)
  name!: string;
  @Transform(trim) @Matches(CODE) typeCode!: string;
  @IsOptional() @IsInt() @Min(0) @Max(100000) capacity?: number;
  @IsOptional() @IsInt() @Min(0) @Max(100000) quantity?: number;
  @IsOptional() @IsBoolean() exclusive?: boolean;
  @IsOptional() @IsBoolean() isDemo?: boolean;
}

export class UpdateResourceDto {
  @IsOptional() @Transform(trim) @IsString() @MinLength(2) @MaxLength(150) name?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100000) capacity?: number;
  @IsOptional() @IsInt() @Min(0) @Max(100000) quantity?: number;
  @IsOptional() @IsBoolean() exclusive?: boolean;
  @IsOptional() @IsIn(['OK', 'MAINTENANCE', 'CLOSED']) maintenanceStatus?: 'OK' | 'MAINTENANCE' | 'CLOSED';
  @IsOptional() @IsBoolean() active?: boolean;
}

export class CreateBlockDto {
  @IsISO8601() from!: string;
  @IsISO8601() to!: string;
  @IsIn(['MAINTENANCE', 'CLOSED']) kind!: 'MAINTENANCE' | 'CLOSED';
  @IsOptional() @IsString() @MaxLength(300) reason?: string;
}

export class AvailabilityQueryDto {
  @IsISO8601() from!: string;
  @IsISO8601() to!: string;
}
