import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Injectable,
  Ip,
  Param,
  ParseUUIDPipe,
  Patch,
  PipeTransform,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type {} from 'multer'; // Express.Multer.File tipi için
import { AdminAuthService } from './admin-auth.service.js';
import { AdminGuard } from './admin.guard.js';
import {
  ChangePasswordDto,
  AiTextDto,
  LoginDto,
  MailSettingsDto,
  MailTestDto,
  UpdateReservationDto,
} from './admin.dto.js';
import { FacilitiesService } from '../facilities/facilities.service.js';
import {
  CreateFacilityDto,
  UpdateFacilityDto,
} from '../facilities/facility.dto.js';
import { NewsService } from '../news/news.service.js';
import { CreateNewsDto, UpdateNewsDto } from '../news/news.dto.js';
import { ReservationsService } from '../reservations/reservations.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ContentService } from '../content/content.service.js';
import { UpsertContentDto } from '../content/content.dto.js';
import { AiService } from '../ai/ai.service.js';
import { FeedbackService } from '../feedback/feedback.service.js';
import { UpdateFeedbackDto } from '../feedback/feedback.dto.js';
import {
  ALLOWED_IMAGE_TYPES,
  hasImageSignature,
  storeImage,
} from './image-storage.js';

const KEY_PATTERN = /^[a-z0-9][a-z0-9._-]{0,118}$/;

@Injectable()
class ContentKeyPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!KEY_PATTERN.test(value)) throw new BadRequestException('Geçersiz metin anahtarı.');
    return value;
  }
}

type AdminRequest = { adminUser: string };

@Controller('admin')
export class AdminController {
  constructor(
    private readonly auth: AdminAuthService,
    private readonly reservations: ReservationsService,
    private readonly facilities: FacilitiesService,
    private readonly news: NewsService,
    private readonly feedback: FeedbackService,
    private readonly content: ContentService,
    private readonly notifications: NotificationsService,
    private readonly ai: AiService,
  ) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Ip() ip: string) {
    return this.auth.login(dto.username, dto.password, ip);
  }

  @Post('password')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  changePassword(@Req() req: AdminRequest, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(
      req.adminUser,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Post('ai/text')
  @UseGuards(AdminGuard)
  @HttpCode(200)
  async aiText(@Body() dto: AiTextDto) {
    return { text: await this.ai.transform(dto.action, dto.text) };
  }

  @Get('me')
  @UseGuards(AdminGuard)
  async me(@Req() req: AdminRequest) {
    return {
      username: req.adminUser,
      defaultPassword: await this.auth.usesDefaultPassword(req.adminUser),
    };
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  async stats() {
    const [byStatus, facilities, news] = await Promise.all([
      this.reservations.countByStatus(),
      this.facilities.count(),
      this.news.count(),
    ]);
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
    return { reservations: { total, byStatus }, facilities, news };
  }

  // --- Rezervasyon talepleri ---
  @Get('reservations')
  @UseGuards(AdminGuard)
  listReservations() {
    return this.reservations.findAll();
  }

  @Patch('reservations/:id')
  @UseGuards(AdminGuard)
  updateReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservations.update(id, dto);
  }

  @Delete('reservations/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeReservation(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservations.remove(id);
  }

  // --- Geri bildirimler ---
  @Get('feedback')
  @UseGuards(AdminGuard)
  listFeedback() {
    return this.feedback.findAll();
  }

  @Patch('feedback/:id')
  @UseGuards(AdminGuard)
  updateFeedback(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFeedbackDto,
  ) {
    return this.feedback.setHandled(id, dto.handled);
  }

  @Delete('feedback/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeFeedback(@Param('id', ParseUUIDPipe) id: string) {
    return this.feedback.remove(id);
  }

  // --- E-posta (SMTP) durumu ve testi ---
  @Get('mail-status')
  @UseGuards(AdminGuard)
  mailStatus() {
    return this.notifications.status();
  }

  @Put('mail-settings')
  @UseGuards(AdminGuard)
  saveMailSettings(@Body() dto: MailSettingsDto) {
    return this.notifications.saveSettings(dto);
  }

  @Delete('mail-settings/password')
  @UseGuards(AdminGuard)
  clearMailPassword() {
    return this.notifications.clearPassword();
  }

  @Post('mail-test')
  @UseGuards(AdminGuard)
  @HttpCode(200)
  mailTest(@Body() dto: MailTestDto) {
    return this.notifications.sendTest(dto.to);
  }

  // --- Site metinleri ---
  @Get('content')
  @UseGuards(AdminGuard)
  listContent() {
    return this.content.asMap();
  }

  @Put('content/:key')
  @UseGuards(AdminGuard)
  saveContent(@Param('key', ContentKeyPipe) key: string, @Body() dto: UpsertContentDto) {
    return this.content.upsert(key, dto);
  }

  @Delete('content/:key')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  resetContent(@Param('key', ContentKeyPipe) key: string) {
    return this.content.reset(key);
  }

  // --- Tesisler ---
  @Get('facilities')
  @UseGuards(AdminGuard)
  listFacilities() {
    return this.facilities.findAll();
  }

  @Post('facilities')
  @UseGuards(AdminGuard)
  createFacility(@Body() dto: CreateFacilityDto) {
    return this.facilities.create(dto);
  }

  @Patch('facilities/:id')
  @UseGuards(AdminGuard)
  updateFacility(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFacilityDto,
  ) {
    return this.facilities.update(id, dto);
  }

  @Delete('facilities/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeFacility(@Param('id', ParseUUIDPipe) id: string) {
    return this.facilities.remove(id);
  }

  // --- Haberler ---
  @Get('news')
  @UseGuards(AdminGuard)
  listNews() {
    return this.news.findAll();
  }

  @Post('news')
  @UseGuards(AdminGuard)
  createNews(@Body() dto: CreateNewsDto) {
    return this.news.create(dto);
  }

  @Patch('news/:id')
  @UseGuards(AdminGuard)
  updateNews(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNewsDto,
  ) {
    return this.news.update(id, dto);
  }

  @Delete('news/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  removeNews(@Param('id', ParseUUIDPipe) id: string) {
    return this.news.remove(id);
  }

  // --- Görsel yükleme ---
  @Post('uploads')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype in ALLOWED_IMAGE_TYPES) return cb(null, true);
        cb(
          new BadRequestException('Yalnızca JPG, PNG veya WebP yüklenebilir.'),
          false,
        );
      },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Dosya seçilmedi.');
    // MIME türü istemciden gelir; gerçek dosya imzasını da doğrula.
    if (!hasImageSignature(file.buffer)) {
      throw new BadRequestException('Dosya geçerli bir görsel değil.');
    }
    return { url: await storeImage(file.buffer, file.mimetype) };
  }
}
