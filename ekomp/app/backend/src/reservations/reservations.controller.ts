import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { Reservation } from './reservation.entity.js';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.reservationsService.create(dto);
  }

  @Get()
  findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }
}
