import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @MinLength(2)
  organizationName!: string;

  @IsString()
  @MinLength(2)
  contactName!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsString()
  @MinLength(2)
  sportBranch!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  groupSize?: number;

  @IsOptional()
  @IsDateString()
  preferredStartDate?: string;

  @IsOptional()
  @IsDateString()
  preferredEndDate?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
