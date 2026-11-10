import { Body, Controller, Get, Ip, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccessGuard, RequirePermission, type PrincipalRequest } from '../identity/access.guard.js';
import type { Actor } from '../identity/identity.service.js';
import { TypeOrmBookingsService } from './bookings.service.js';
import { BookingListQueryDto, CreateBookingDto, TransitionDto } from './scheduling.dto.js';

const actorOf = (req: PrincipalRequest, ip: string): Actor => ({
  userId: req.principal.userId ?? null,
  label: req.principal.label,
  ip,
});

/** Rezervasyonlar: kaynak tahsisli talepler. PostgreSQL'e özgüdür; eski `reservations` talep formundan ayrıdır. */
@Controller('bookings')
@UseGuards(AccessGuard)
export class BookingsController {
  constructor(private readonly bookings: TypeOrmBookingsService) {}

  @Get()
  @RequirePermission('booking:view_all')
  list(@Query() q: BookingListQueryDto) {
    return this.bookings.list(q);
  }

  @Get(':id')
  @RequirePermission('booking:view_all')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookings.get(id);
  }

  @Post()
  @RequirePermission('booking:create')
  create(@Req() req: PrincipalRequest, @Body() dto: CreateBookingDto, @Ip() ip: string) {
    return this.bookings.create(dto, actorOf(req, ip));
  }

  @Post(':id/transition')
  @RequirePermission('booking:approve')
  transition(
    @Req() req: PrincipalRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionDto,
    @Ip() ip: string,
  ) {
    return this.bookings.transition(id, dto.to, dto.note ?? '', actorOf(req, ip));
  }
}
