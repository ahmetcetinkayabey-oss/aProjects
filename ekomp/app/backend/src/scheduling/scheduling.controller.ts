import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Ip,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard, RequirePermission, type PrincipalRequest } from '../identity/access.guard.js';
import type { Actor } from '../identity/identity.service.js';
import {
  AvailabilityQueryDto,
  CreateBlockDto,
  CreateResourceDto,
  CreateTypeDto,
  UpdateResourceDto,
} from './scheduling.dto.js';
import { TypeOrmSchedulingService } from './scheduling.service.js';

const actorOf = (req: PrincipalRequest, ip: string): Actor => ({
  userId: req.principal.userId ?? null,
  label: req.principal.label,
  ip,
});

/** Hizmet ve kaynak yönetimi (izin: service:manage). Yalnızca PostgreSQL'de etkindir. */
@Controller('resources')
@UseGuards(AccessGuard)
@RequirePermission('service:manage')
export class SchedulingController {
  constructor(private readonly scheduling: TypeOrmSchedulingService) {}

  @Get('types')
  types() {
    return this.scheduling.listTypes();
  }

  @Post('types')
  createType(@Req() req: PrincipalRequest, @Body() dto: CreateTypeDto, @Ip() ip: string) {
    return this.scheduling.createType(dto, actorOf(req, ip));
  }

  @Get()
  list(@Query('type') type?: string, @Query('all') all?: string) {
    return this.scheduling.listResources({ typeCode: type, includeInactive: all === '1' });
  }

  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.scheduling.getResource(id);
  }

  @Post()
  create(@Req() req: PrincipalRequest, @Body() dto: CreateResourceDto, @Ip() ip: string) {
    return this.scheduling.createResource(dto, actorOf(req, ip));
  }

  @Patch(':id')
  update(
    @Req() req: PrincipalRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateResourceDto,
    @Ip() ip: string,
  ) {
    return this.scheduling.updateResource(id, dto, actorOf(req, ip));
  }

  @Get(':id/availability')
  availability(@Param('id', ParseUUIDPipe) id: string, @Query() q: AvailabilityQueryDto) {
    return this.scheduling.availability(id, q.from, q.to);
  }

  @Get(':id/blocks')
  blocks(@Param('id', ParseUUIDPipe) id: string) {
    return this.scheduling.listBlocks(id);
  }

  @Post(':id/blocks')
  createBlock(
    @Req() req: PrincipalRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateBlockDto,
    @Ip() ip: string,
  ) {
    return this.scheduling.createBlock(id, dto, actorOf(req, ip));
  }

  @Delete(':id/blocks/:blockId')
  @HttpCode(204)
  async deleteBlock(
    @Req() req: PrincipalRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('blockId', ParseUUIDPipe) blockId: string,
    @Ip() ip: string,
  ) {
    await this.scheduling.deleteBlock(id, blockId, actorOf(req, ip));
  }
}
