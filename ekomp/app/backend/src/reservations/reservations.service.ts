import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {}

  create(dto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationsRepository.create(dto);
    return this.reservationsRepository.save(reservation);
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({ order: { createdAt: 'DESC' } });
  }
}
