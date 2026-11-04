import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard.js';
import {
  AnnouncementDto,
  MediaDto,
  SessionDto,
  SpeakerDto,
  SponsorDto,
  UpdateParticipantDto,
} from './forum.dto.js';
import { ForumService } from './forum.service.js';

/** Güncellemelerde yalnızca gönderilen alanlar doğrulanır. */
const partial = new ValidationPipe({
  whitelist: true,
  transform: true,
  skipMissingProperties: true,
});

@Controller('admin/forum')
@UseGuards(AdminGuard)
export class ForumAdminController {
  constructor(private readonly forum: ForumService) {}

  @Get('stats')
  stats() {
    return this.forum.stats();
  }

  @Get('participants')
  participants() {
    return this.forum.listParticipants();
  }

  @Patch('participants/:id')
  updateParticipant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateParticipantDto,
  ) {
    return this.forum.updateParticipant(id, dto);
  }

  // --- Program ---
  @Get('sessions')
  sessions() {
    return this.forum.listSessions();
  }
  @Post('sessions')
  createSession(@Body() dto: SessionDto) {
    return this.forum.saveSession(dto);
  }
  @Patch('sessions/:id')
  updateSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(partial) dto: SessionDto,
  ) {
    return this.forum.saveSession(dto, id);
  }
  @Delete('sessions/:id')
  @HttpCode(204)
  removeSession(@Param('id', ParseUUIDPipe) id: string) {
    return this.forum.remove('sessions', id);
  }

  // --- Konuşmacılar ---
  @Get('speakers')
  speakers() {
    return this.forum.listSpeakers();
  }
  @Post('speakers')
  createSpeaker(@Body() dto: SpeakerDto) {
    return this.forum.saveSpeaker(dto);
  }
  @Patch('speakers/:id')
  updateSpeaker(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(partial) dto: SpeakerDto,
  ) {
    return this.forum.saveSpeaker(dto, id);
  }
  @Delete('speakers/:id')
  @HttpCode(204)
  removeSpeaker(@Param('id', ParseUUIDPipe) id: string) {
    return this.forum.remove('speakers', id);
  }

  // --- Medya ---
  @Get('media')
  media() {
    return this.forum.listMedia();
  }
  @Post('media')
  createMedia(@Body() dto: MediaDto) {
    return this.forum.saveMedia(dto);
  }
  @Patch('media/:id')
  updateMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(partial) dto: MediaDto,
  ) {
    return this.forum.saveMedia(dto, id);
  }
  @Delete('media/:id')
  @HttpCode(204)
  removeMedia(@Param('id', ParseUUIDPipe) id: string) {
    return this.forum.remove('media', id);
  }

  // --- Duyurular ---
  @Get('announcements')
  announcements() {
    return this.forum.listAnnouncements();
  }
  @Post('announcements')
  createAnnouncement(@Body() dto: AnnouncementDto) {
    return this.forum.saveAnnouncement(dto);
  }
  @Patch('announcements/:id')
  updateAnnouncement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(partial) dto: AnnouncementDto,
  ) {
    return this.forum.saveAnnouncement(dto, id);
  }
  @Delete('announcements/:id')
  @HttpCode(204)
  removeAnnouncement(@Param('id', ParseUUIDPipe) id: string) {
    return this.forum.remove('announcements', id);
  }

  // --- Destekçiler ---
  @Get('sponsors')
  sponsors() {
    return this.forum.listSponsors();
  }
  @Post('sponsors')
  createSponsor(@Body() dto: SponsorDto) {
    return this.forum.saveSponsor(dto);
  }
  @Patch('sponsors/:id')
  updateSponsor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(partial) dto: SponsorDto,
  ) {
    return this.forum.saveSponsor(dto, id);
  }
  @Delete('sponsors/:id')
  @HttpCode(204)
  removeSponsor(@Param('id', ParseUUIDPipe) id: string) {
    return this.forum.remove('sponsors', id);
  }
}
