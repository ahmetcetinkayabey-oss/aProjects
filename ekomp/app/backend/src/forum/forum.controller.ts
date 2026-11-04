import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Ip,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ForumAuthService } from './forum-auth.service.js';
import {
  ParticipantGuard,
  type ParticipantRequest,
} from './forum-participant.guard.js';
import {
  ForgotPasswordDto,
  ForumLoginDto,
  RegisterDto,
  ResetPasswordDto,
  TokenDto,
  UpdateProfileDto,
} from './forum.dto.js';
import { ForumService } from './forum.service.js';
import { PublicFormRateLimitGuard } from '../common/rate-limit.guard.js';

@Controller('forum')
export class ForumController {
  constructor(
    private readonly forum: ForumService,
    private readonly auth: ForumAuthService,
  ) {}

  // --- Herkese açık içerik ---
  @Get('program')
  program() {
    return this.forum.publicProgram();
  }

  @Get('speakers')
  speakers() {
    return this.forum.publicSpeakers();
  }

  @Get('media')
  media() {
    return this.forum.publicMedia();
  }

  @Get('announcements')
  announcements() {
    return this.forum.publicAnnouncements();
  }

  @Get('sponsors')
  sponsors() {
    return this.forum.publicSponsors();
  }

  @Get('organizations')
  organizations() {
    return this.forum.publicOrganizations();
  }

  // --- Kayıt ve giriş ---
  @Post('auth/register')
  @UseGuards(PublicFormRateLimitGuard)
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('auth/verify-email')
  @HttpCode(200)
  verifyEmail(@Body() dto: TokenDto) {
    return this.auth.verifyEmail(dto.token);
  }

  @Post('auth/login')
  @HttpCode(200)
  login(@Body() dto: ForumLoginDto, @Ip() ip: string) {
    return this.auth.login(dto.email, dto.password, ip);
  }

  @Post('auth/forgot-password')
  @UseGuards(PublicFormRateLimitGuard)
  @HttpCode(200)
  forgot(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto.email);
  }

  @Post('auth/reset-password')
  @HttpCode(200)
  reset(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto.token, dto.password);
  }

  // --- Katılımcı paneli ---
  @Get('me')
  @UseGuards(ParticipantGuard)
  me(@Req() req: ParticipantRequest) {
    return this.auth.getProfile(req.participantId);
  }

  @Patch('me')
  @UseGuards(ParticipantGuard)
  updateMe(@Req() req: ParticipantRequest, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(req.participantId, dto);
  }

  /** Yalnızca yönetici tarafından onaylanmış katılımcılar dizine erişir. */
  @Get('directory')
  @UseGuards(ParticipantGuard)
  async directory(@Req() req: ParticipantRequest) {
    const list = await this.forum.directory(req.participantId);
    if (!list) throw new ForbiddenException('NOT_APPROVED');
    return list;
  }
}
