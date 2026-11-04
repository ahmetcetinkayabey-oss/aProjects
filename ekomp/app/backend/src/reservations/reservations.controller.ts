import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PublicFormRateLimitGuard } from '../common/rate-limit.guard.js';
import { ReservationsService } from './reservations.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { Reservation } from './reservation.entity.js';

/** Herkese açık: yalnızca talep oluşturma. Listeleme ve yönetim /api/admin altındadır. */
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(PublicFormRateLimitGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.create(dto);
  }
}
