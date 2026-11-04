import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  organizationName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  contactName!: string;

  @IsEmail()
  @MaxLength(200)
  email!: string;

  @IsPhoneNumber()
  @MaxLength(30)
  phone!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  sportBranch!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  groupSize?: number;

  @IsOptional()
  @IsDateString()
  preferredStartDate?: string;

  @IsOptional()
  @IsDateString()
  preferredEndDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;
}
