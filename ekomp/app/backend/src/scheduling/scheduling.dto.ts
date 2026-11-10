import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEmail, IsIn, IsInt, IsISO8601, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator';

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

export class BookingItemDto {
  @IsUUID() resourceId!: string;
  @IsISO8601() from!: string;
  @IsISO8601() to!: string;
  @IsOptional() @IsInt() @Min(1) @Max(100000) quantity?: number;
}

export class BookingCustomerDto {
  @Transform(trim) @IsString() @MinLength(2) @MaxLength(200) name!: string;
  @IsOptional() @IsEmail() @MaxLength(200) email?: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
}

export class CreateBookingDto {
  @IsIn(['ADMIN_PANEL', 'MANUAL_ENTRY']) source!: 'ADMIN_PANEL' | 'MANUAL_ENTRY';
  @ValidateNested() @Type(() => BookingCustomerDto) customer!: BookingCustomerDto;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsInt() @Min(1) @Max(100000) participantCount?: number;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsOptional() @IsInt() @Min(1) @Max(720) holdHours?: number;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @ValidateNested({ each: true }) @Type(() => BookingItemDto)
  items!: BookingItemDto[];
}

export const BOOKING_STATUSES = [
  'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'QUOTATION_PREPARED', 'AWAITING_CUSTOMER_APPROVAL', 'AWAITING_ADMIN_APPROVAL',
  'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLATION_REQUESTED', 'CANCELLED', 'REJECTED', 'EXPIRED',
] as const;

export class TransitionDto {
  @IsIn(BOOKING_STATUSES as unknown as string[]) to!: (typeof BOOKING_STATUSES)[number];
  @IsOptional() @IsString() @MaxLength(500) note?: string;
}

export class BookingListQueryDto {
  @IsOptional() @IsIn(BOOKING_STATUSES as unknown as string[]) status?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize?: number;
}
